import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';

const BookingStatusChecker = () => {
  const [bookingId, setBookingId] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) return;

    setIsLoading(true);
    setError('');
    setBookingData(null);

    try {
      // Call n8n webhook to check status
      const response = await fetch(`https://home.tiffany-major.ts.net/webhook/check-booking-status?id=${encodeURIComponent(bookingId.trim())}`);

      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }

      const data = await response.json();

      if (data && data.found) {
        setBookingData(data.booking);
      } else {
        setError('Booking number not found. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to check status. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCheckStatus} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Enter Booking Number (e.g. ABC123XYZ)"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 min-w-[150px]"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Check Status'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {bookingData && (
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between ${bookingData.status === 'Confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
              bookingData.status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-700' :
                'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white shadow-sm shrink-0">
                {bookingData.status === 'Confirmed' ? <CheckCircle2 size={24} /> :
                  bookingData.status === 'Cancelled' ? <XCircle size={24} /> :
                    <Clock size={24} />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Status</p>
                <p className="text-xl font-black">{bookingData.status}</p>
              </div>
            </div>

            <div className="w-full sm:w-auto grid grid-cols-2 gap-x-8 gap-y-2 text-sm bg-white/50 p-3 rounded-xl">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Date & Time</p>
                <p className="font-medium">{bookingData.date} @ {bookingData.time}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Guests</p>
                <p className="font-medium">{bookingData.guests}</p>
              </div>
              <div className="col-span-2 pt-2 mt-1 border-t border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total Price</p>
                <p className="font-black text-lg">${bookingData.price}</p>
              </div>
            </div>
          </div>

          {bookingData.status === 'Pending' && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="bg-pink-500 text-white p-1 rounded-md text-[10px] uppercase tracking-wider">Action Needed</span>
                Complete Your Payment
              </h4>
              <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                Your booking is held but not confirmed. To confirm, please send the total amount of <span className="font-bold text-pink-400">${bookingData.price}</span> via Zelle.
              </p>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl font-mono relative group mb-3">
                <p className="text-center text-lg font-bold">payments@besticecream.com</p>
              </div>
              <p className="text-xs text-slate-400 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1 shrink-0"></div>
                Important: Include your booking number ({bookingId}) in the Zelle memo so we can match your payment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingStatusChecker;
