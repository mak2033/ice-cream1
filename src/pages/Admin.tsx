import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, LogOut, Search, Download, ExternalLink, Filter, ChevronDown, Loader2, ShieldCheck } from 'lucide-react';
import { Booking } from '@/src/types';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [strikeData, setStrikeData] = useState(() => {
    const data = localStorage.getItem('admin_login_strikes');
    return data ? JSON.parse(data) : { strikes: 0, lockUntil: null };
  });

  // Fetch bookings automatically if returning to page and already logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
    }
  }, [isLoggedIn]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      // Optimistically update the UI
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus as any } : b)
      );

      // Webhook to update Google Sheets 
      const updateWebhookUrl = 'https://home.tiffany-major.ts.net/webhook/update-booking-status';
      await fetch(updateWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus
        })
      });
      
      // If deleted, refresh the list completely to remove it from view
      if (newStatus === 'Delete') {
         setTimeout(fetchBookings, 500); 
      }
      
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert if absolute failure, but normally n8n just processes it silently
      fetchBookings();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if locked
    if (strikeData.lockUntil) {
      const remainingMs = strikeData.lockUntil - new Date().getTime();
      if (remainingMs > 0) {
        if (strikeData.strikes >= 9) {
          setError('Access denied (IP logged). Contact support.');
        } else {
          const remainingMinutes = Math.ceil(remainingMs / 60000);
          setError(`Too many failed attempts. Try again in ${remainingMinutes} minute(s).`);
        }
        return;
      }
    }

    if (username === "alkh2044" && password === "Jtc@123456") {
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.removeItem('admin_login_strikes');
      setStrikeData({ strikes: 0, lockUntil: null });
      setIsLoggedIn(true);
    } else {
      const newStrikes = strikeData.strikes + 1;
      let newLockUntil = null;
      let localError = 'Invalid username or password.';
      
      if (newStrikes >= 9) {
        newLockUntil = new Date().getTime() + (365 * 24 * 60 * 60 * 1000); // 1 year
        localError = 'Access denied (IP logged). Contact support.';
      } else if (newStrikes === 6) {
        newLockUntil = new Date().getTime() + (5 * 60 * 1000); // 5 mins
        localError = 'Too many failed attempts. Try again in 5 minutes.';
      } else if (newStrikes === 3) {
        newLockUntil = new Date().getTime() + (1 * 60 * 1000); // 1 min
        localError = 'Too many failed attempts. Try again in 1 minute.';
      } else {
        const attemptsLeft = (newStrikes < 3) ? (3 - newStrikes) : (newStrikes < 6 ? (6 - newStrikes) : (9 - newStrikes));
        localError = `Invalid username or password. ${attemptsLeft} attempt(s) left.`;
      }

      const newData = { strikes: newStrikes, lockUntil: newLockUntil || null };
      setStrikeData(newData);
      localStorage.setItem('admin_login_strikes', JSON.stringify(newData));
      setError(localError);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Fetching from secure n8n webhook
      const webhookUrl = 'https://home.tiffany-major.ts.net/webhook/admin-bookings';
      const response = await fetch(webhookUrl);
      
      if (!response.ok) throw new Error('Failed to fetch bookings data');
      
      const responseData = await response.json();
      const rawData = Array.isArray(responseData) ? responseData : (responseData.data || []);
      
      const parsedBookings: Booking[] = rawData.map((row: any, index: number) => {
        // Normalize keys to lowercase for easier matching, since n8n column names can vary
        const normalizedRow: any = {};
        if (row && typeof row === 'object') {
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().trim()] = row[key];
          });
        }

        const getVal = (names: string[]) => {
          for (const name of names) {
            const n = name.toLowerCase().trim();
            if (normalizedRow[n] !== undefined && normalizedRow[n] !== null) {
              return normalizedRow[n];
            }
          }
          return '';
        };

        const rawGuests = getVal(['guests', 'guest count', 'number of guests']);
        const guestsNum = parseInt(String(rawGuests), 10);

        return {
          id: String(row['#'] || getVal(['id', '#', 'booking number', 'col_1']) || `ID-${index}`).trim(),
          timestamp: String(getVal(['timestamp', 'time']) || '').trim(),
          name: String(getVal(['name', 'customer', 'col_2']) || 'Unknown').trim(),
          email: String(getVal(['email', 'mail']) || 'N/A').trim(),
          phone: String(getVal(['phone', 'phone number', 'col_3']) || 'N/A').trim(),
          date: String(getVal(['event date', 'date', 'col_4']) || 'N/A').trim(),
          time: String(getVal(['event time', 'time', 'col_5']) || 'N/A').trim(),
          address: String(getVal(['address', 'location', 'col_6']) || 'N/A').trim(),
          guests: isNaN(guestsNum) ? 0 : guestsNum,
          googleMapsUrl: String(getVal(['google maps url', 'google map link', 'map url']) || '').trim(),
          booked_at: String(getVal(['booked at', 'created', 'col_8']) || '').trim(),
          status: String(getVal(['status', 'col_7']) || 'Pending').trim() as any
        };
      }).filter((b: Booking) => b.name !== 'Unknown' && b.name !== 'Name'); // filter out headers or empty rows

      setBookings(parsedBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const header = ['#', 'Timestamp', 'Name', 'Email', 'Phone', 'Event Date', 'Event Time', 'Address', 'Guests', 'Google Maps URL', 'Booked At', 'Status'];
    const rows = bookings.map(b => [b.id, b.timestamp, b.name, b.email, b.phone, b.date, b.time, b.address, b.guests, b.googleMapsUrl, b.booked_at, b.status]);
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
                placeholder="Enter username"
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

  const filteredBookings = bookings.filter((booking) => {
    let isPastEvent = false;
    try {
      if (booking.date !== 'N/A') {
        const eventDateTime = new Date(`${booking.date}T${booking.time !== 'N/A' ? booking.time : '00:00:00'}`);
        if (!isNaN(eventDateTime.getTime()) && eventDateTime < new Date()) {
          isPastEvent = true;
        }
      }
    } catch (e) {}

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      const currentStatus = isPastEvent ? 'Ended' : (booking.status || 'Pending');
      matchesStatus = currentStatus.toLowerCase() === statusFilter.toLowerCase();
    }

    const searchString = `${booking.name} ${booking.email} ${booking.phone} ${booking.id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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
          onClick={handleLogout}
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
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none flex items-center gap-2 px-10 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 outline-none cursor-pointer transition-all bg-white"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Ended">Ended</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => {
                  // Determine if event is in the past
                  let isPastEvent = false;
                  try {
                    if (booking.date !== 'N/A') {
                      // Attempt to parse "YYYY-MM-DD" or similar and compare to now
                      const eventDateTime = new Date(`${booking.date}T${booking.time !== 'N/A' ? booking.time : '00:00:00'}`);
                      if (!isNaN(eventDateTime.getTime()) && eventDateTime < new Date()) {
                        isPastEvent = true;
                      }
                    }
                  } catch (e) {
                    // Ignore invalid dates
                  }

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-all">
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono text-slate-400">#{booking.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{booking.name}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {booking.email !== 'N/A' && booking.email}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {booking.phone !== 'N/A' && booking.phone}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium whitespace-nowrap ${isPastEvent ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {booking.date} @ {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-700 truncate max-w-[200px]" title={booking.address}>{booking.address}</div>
                        {booking.googleMapsUrl && (
                          <a href={booking.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline mt-1 inline-block">
                            <ExternalLink size={10} className="inline mr-1 -mt-0.5" />
                            Maps
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{booking.guests}</td>
                      <td className="px-6 py-4">
                        {isPastEvent ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                            Ended ({booking.date})
                          </span>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            String(booking.status || '').toLowerCase() === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                            String(booking.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {booking.status || 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) handleStatusChange(booking.id, e.target.value);
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-transparent outline-none cursor-pointer border border-slate-200 rounded px-2 py-1 appearance-none"
                            style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', paddingRight: '20px' }}
                          >
                            <option value="" disabled hidden>Action</option>
                            <option value="Confirmed">Mark Confirmed</option>
                            <option value="Pending">Mark Pending</option>
                            <option value="Cancelled">Mark Cancelled</option>
                            <option value="Delete" className="text-red-500">Delete</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredBookings.length === 0 && !isLoading && (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">No bookings found matching criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
