import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';

const BookingStatusChecker = () => {
  const [bookingId, setBookingId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) return;

    setIsLoading(true);
    setError('');
    setStatus(null);

    try {
      // Fetch from the Google Sheet CSV export
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/1Vjly0TePWjYXbztVzgO8qkaYUR3pK-C6333cM87ete4/export?format=csv&gid=1443537330';
      const response = await fetch(sheetUrl);
      const csvText = await response.text();
      
      const rows = csvText.split('\n').slice(1);
      const booking = rows.find(row => {
        const cols = row.split(',').map(c => c.replace(/^"|"$/g, '').trim());
        return cols[0] === bookingId.trim();
      });

      if (booking) {
        const cols = booking.split(',').map(c => c.replace(/^"|"$/g, '').trim());
        setStatus(cols[7] || 'Pending');
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

      {status && (
        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${
          status === 'Confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
          status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-700' :
          'bg-amber-50 border-amber-100 text-amber-700'
        }`}>
          <div className="p-3 rounded-xl bg-white shadow-sm">
            {status === 'Confirmed' ? <CheckCircle2 size={24} /> :
             status === 'Cancelled' ? <XCircle size={24} /> :
             <Clock size={24} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Current Status</p>
            <p className="text-xl font-black">{status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatusChecker;
