import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users, Send, CheckCircle2, Loader2, Navigation, Phone, ExternalLink, Search, MousePointerClick, Satellite, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PricingTier } from '../types';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    address: '',
    guests: 50,
  });
  const [bookingNumber, setBookingNumber] = useState('');

  const [position, setPosition] = useState<[number, number]>([41.8781, -87.6298]); // Default Chicago
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [shouldFly, setShouldFly] = useState(false);
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);

  // Fetch Pricing Tiers
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('https://home.tiffany-major.ts.net/webhook/pricing');
        const rawData = await response.json();
        
        const dataArray = Array.isArray(rawData) ? rawData : (rawData.MinGuests !== undefined || rawData.minGuests !== undefined ? [rawData] : []);
        
        if (dataArray.length > 0) {
          const mappedTiers = dataArray.map((row: any, index: number) => ({
            id: row.id || String(row.row_number || index),
            minGuests: Number(row.MinGuests !== undefined ? row.MinGuests : row.minGuests),
            maxGuests: Number(row.MaxGuests !== undefined ? row.MaxGuests : row.maxGuests),
            price: Number(row.Price !== undefined ? row.Price : row.price)
          }));
          setPricingTiers(mappedTiers);
        } else {
          throw new Error("No tiers returned");
        }
      } catch (err) {
        console.error("Failed to load pricing, using defaults:", err);
        // Fallback to defaults if webhook fails
        setPricingTiers([
          { id: '1', minGuests: 1, maxGuests: 50, price: 50 },
          { id: '2', minGuests: 51, maxGuests: 100, price: 90 },
          { id: '3', minGuests: 101, maxGuests: 200, price: 150 },
          { id: '4', minGuests: 201, maxGuests: 9999, price: 200 },
        ]);
      } finally {
        setIsLoadingTiers(false);
      }
    };
    fetchPricing();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getPrice = (guests: number) => {
    if (pricingTiers.length === 0) return 0;
    
    // Sort tiers by minGuests just in case
    const sortedTiers = [...pricingTiers].sort((a, b) => a.minGuests - b.minGuests);
    
    // Find matching tier
    for (const tier of sortedTiers) {
      if (guests >= tier.minGuests && guests <= tier.maxGuests) {
        return tier.price;
      }
    }
    
    // If over max, return the highest tier price
    return sortedTiers[sortedTiers.length - 1].price;
  };

  // Helper to fly the map when location changes
  const FlyToLocation = () => {
    const map = useMap();
    useEffect(() => {
      if (shouldFly && position) {
        map.flyTo(position, 15, { duration: 1.5 });
        setShouldFly(false);
      }
    }, [position, shouldFly, map]);
    return null;
  };

  // Map Click Handler — click to set pin & reverse geocode to address
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        // Reverse Geocoding using free Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setFormData(prev => ({ ...prev, address: data.display_name }));
            }
          })
          .catch(err => console.error("Geocoding failed", err));
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  // Search address using Nominatim (free, no API key needed) & fly to it
  const handleSearchAddress = async () => {
    if (!formData.address.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setShouldFly(true);
        setFormData(prev => ({ ...prev, address: display_name }));
      }
    } catch (err) {
      console.error('Address search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key in address field
  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchAddress();
    }
  };

  // Use browser geolocation
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setShouldFly(true);

        // Reverse geocode to get the address text
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setFormData(prev => ({ ...prev, address: data.display_name }));
            }
          })
          .catch(err => console.error("Geocoding failed", err))
          .finally(() => setIsLocating(false));
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const generatedId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const calculatedPrice = getPrice(Number(formData.guests));

    const bookingPayload = {
      ...formData,
      googleMapsURL: `https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`,
      price: calculatedPrice,
      id: generatedId,
      status: 'Pending',
      booked_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://home.tiffany-major.ts.net/webhook/booking', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        if (responseText) {
          data = JSON.parse(responseText);
        }
      } catch (e) {
        console.warn("Failed to parse JSON response:", responseText);
      }

      // DEBUG: Show exactly what n8n sent to the frontend
      console.log("RAW n8n RESPONSE:", responseText);
      console.log("PARSED n8n DATA:", data);

      if (data.success === true || data.success === "true") {
        setBookingNumber(data.booking_number || generatedId);
        setStep(2);
      } else {
        alert(`n8n sent back: ${responseText || 'Empty Response'}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(`Network error: ${error.message || 'Failed to connect'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-2xl mx-auto border border-slate-100"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2">Booking Requested!</h2>
        <div className="mb-8">
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold mb-2">Your Booking Number</p>
          <p className="text-6xl font-black text-pink-500 tracking-tighter">{bookingNumber}</p>
        </div>
        <p className="text-slate-600 mb-8 leading-relaxed">
          We've received your request for {formData.date} at {formData.time}. Our team will review the details and get back to you shortly.
        </p>

        <div className="bg-amber-50 p-8 rounded-3xl text-left mb-8 border border-amber-100">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="bg-amber-200 p-1 rounded-md text-xs">NEXT STEP</span>
            Complete Your Payment
          </h3>
          <p className="text-sm text-amber-800 mb-4">
            To confirm your booking, please send the deposit of <span className="font-bold">${getPrice(Number(formData.guests))}</span> via Zelle:
          </p>
          <div className="bg-white p-4 rounded-xl border border-amber-200 font-mono text-lg font-bold text-center mb-4">
            payments@besticecream.com
          </div>
          <ul className="text-xs text-amber-700 space-y-2 list-disc pl-4">
            <li>Include your booking number <span className="font-bold">{bookingNumber}</span> in the Zelle memo.</li>
            <li>Booking status will be updated to "Confirmed" once payment is received.</li>
            <li>You will receive a confirmation email/text.</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="text-pink-500 font-bold hover:underline"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100"
    >
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Reserve the Truck</h2>
          <p className="text-slate-500">Fill out the details below and we'll handle the rest.</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Total</p>
          <p className="text-3xl font-black text-slate-900">${getPrice(Number(formData.guests))}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Event Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Event Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                min={formData.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Event Address</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                onKeyDown={handleAddressKeyDown}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="123 Sweet St, Chicago, IL"
              />
            </div>
            <button
              type="button"
              onClick={handleSearchAddress}
              disabled={isSearching || !formData.address.trim()}
              className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {isSearching ? 'Searching...' : 'Find'}
            </button>
          </div>

          {/* Interactive Map — click to set pin */}
          <div className="mt-4 border border-slate-100 rounded-3xl overflow-hidden bg-slate-50 p-2 relative">
            <div className="absolute bottom-6 left-4 z-[400]">
              <button
                type="button"
                onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 font-bold text-[11px] transition-all active:scale-95"
              >
                {mapView === 'street' ? (
                  <><Satellite size={14} className="text-pink-500" /> Satellite</>
                ) : (
                  <><Map size={14} className="text-pink-500" /> Street</>
                )}
              </button>
            </div>

            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
              <div className="bg-white text-slate-700 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-slate-100 flex items-center gap-1">
                <MousePointerClick size={12} className="text-pink-500" /> Click map to set location
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeolocate}
              disabled={isLocating}
              className="absolute bottom-6 right-4 z-[400] bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-bold text-xs transition-all active:scale-95 disabled:opacity-70"
            >
              {isLocating ? <Loader2 size={16} className="animate-spin text-pink-500" /> : <Navigation size={16} className="text-pink-500" />}
              {isLocating ? 'Locating...' : 'Use My Location'}
            </button>

            <div className="h-[300px] rounded-2xl overflow-hidden shadow-inner w-full relative z-0">
              <MapContainer center={position} zoom={11} scrollWheelZoom={false} className="h-full w-full">
                {mapView === 'satellite' ? (
                  <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                ) : (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                )}
                <LocationMarker />
                <FlyToLocation />
              </MapContainer>
            </div>
          </div>

          {/* Google Maps Link */}
          {formData.address && (
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
              <span className="text-[10px] text-slate-400 font-mono">
                {position[0].toFixed(5)}, {position[1].toFixed(5)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Estimated Guests</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="50"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              Pricing Tiers
              {isLoadingTiers && <Loader2 size={12} className="animate-spin text-slate-400" />}
            </h4>
            <div className="space-y-2">
              {pricingTiers.map(tier => (
                <div key={tier.id} className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">
                    {tier.maxGuests >= 9999 ? `${tier.minGuests}+ Guests` : `${tier.minGuests} - ${tier.maxGuests} Guests`}
                  </span>
                  <span className="text-slate-900 font-bold">${tier.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-100 flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
        </button>
      </form>
    </motion.div>
  );
};

export default BookingForm;
