import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Users, Send, CheckCircle2, Map as MapIcon, Loader2 } from 'lucide-react';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    address: '',
    guests: 50,
  });
  const [bookingNumber, setBookingNumber] = useState('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getPrice = (guests: number) => {
    if (guests <= 50) return 50;
    if (guests <= 100) return 90;
    if (guests <= 200) return 150;
    return 150 + (Math.ceil((guests - 200) / 50) * 40); // Estimate for more
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const generatedId = Math.random().toString(36).substr(2, 9).toUpperCase();

    const bookingPayload = {
      ...formData,
      id: generatedId,
      status: 'Pending',
      booked_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      
      const data = await response.json();
      // Use the ID from response if available, otherwise use generated
      setBookingNumber(data.id || generatedId);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert('Failed to submit booking.');
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
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
            <div className="relative">
              <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="(312) 555-0123"
              />
            </div>
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
                className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Event Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="123 Sweet St, Chicago, IL"
            />
          </div>
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
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pricing Tiers</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">1 - 50 Guests</span>
                <span className="text-slate-900 font-bold">$50</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">51 - 100 Guests</span>
                <span className="text-slate-900 font-bold">$90</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">101 - 200 Guests</span>
                <span className="text-slate-900 font-bold">$150</span>
              </div>
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
