import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, LogOut, Search, Download, ExternalLink, Filter, ChevronDown, Loader2, ShieldCheck } from 'lucide-react';
import { Booking } from '@/src/types';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username === "alkh2044" && password === "Jtc@123456") {
      setIsLoggedIn(true);
      // Wait a bit for the UI to transition then fetch
      setTimeout(fetchBookings, 100);
    } else {
      setError('Invalid username or password');
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Fetching from the Google Sheet CSV export (Bookings tab)
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/1Vjly0TePWjYXbztVzgO8qkaYUR3pK-C6333cM87ete4/export?format=csv&gid=1443537330';
      const response = await fetch(sheetUrl);
      const csvText = await response.text();
      
      const rows = csvText.split('\n').filter(row => row.trim()).slice(1);
      const parsedBookings: Booking[] = rows.map((row, index) => {
        // Handle CSV with potential commas in quotes
        const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());
        
        return {
          id: cleanCols[0] || `ID-${index}`,
          name: cleanCols[1] || 'Unknown',
          phone: cleanCols[2] || 'N/A',
          date: cleanCols[3] || 'N/A',
          time: cleanCols[4] || 'N/A',
          address: cleanCols[5] || 'N/A',
          guests: parseInt(cleanCols[6]) || 0,
          status: (cleanCols[7] as any) || 'Pending',
          booked_at: cleanCols[8] || new Date().toISOString()
        };
      }).filter(b => b.name !== 'Unknown');
      setBookings(parsedBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const header = ['ID', 'Name', 'Phone', 'Date', 'Time', 'Address', 'Guests', 'Status', 'Booked At'];
    const rows = bookings.map(b => [b.id, b.name, b.phone, b.date, b.time, b.address, b.guests, b.status, b.booked_at]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Login</h1>
            <p className="text-slate-500 text-sm">Secure access to Best Ice Cream dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                placeholder="alkh2044"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col gap-8 hidden lg:flex">
        <div className="flex items-center gap-2 text-white">
          <LayoutDashboard size={24} className="text-pink-500" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-xl transition-all">
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Bookings</span>
          </button>
        </nav>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-3 px-4 py-3 hover:text-white transition-all mt-auto"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">Event Bookings</h1>
            <p className="text-slate-500 text-[10px] md:text-xs">Manage and track all ice cream truck reservations</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
            <button
              onClick={fetchBookings}
              className="p-2 text-slate-400 hover:text-slate-600 transition-all"
            >
              <Loader2 className={isLoading ? "animate-spin" : ""} size={20} />
            </button>
            <button
              onClick={exportToCSV}
              className="flex-1 sm:flex-none bg-slate-900 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all whitespace-nowrap"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search bookings..."
              className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Status: All <ChevronDown size={14} />
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{booking.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{booking.name}</div>
                      <div className="text-xs text-slate-500">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 font-medium">{booking.date} at {booking.time}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">{booking.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{booking.guests}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' :
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-xs font-bold text-slate-400 hover:text-slate-900">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && !isLoading && (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">No bookings found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
