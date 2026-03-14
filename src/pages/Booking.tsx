import React from 'react';
import BookingForm from '@/src/components/BookingForm';
import { ArrowRight } from 'lucide-react';

const Booking = () => {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-pink-500 font-bold uppercase tracking-widest text-sm mb-4 block">Reservation</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Book the Truck</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Ready to bring the party to your neighborhood? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>
        
        <BookingForm />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Request</h3>
            <p className="text-sm text-slate-500">Submit your event details via our form.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Deposit</h3>
            <p className="text-sm text-slate-500">Send a small deposit via Zelle to lock your date.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Enjoy</h3>
            <p className="text-sm text-slate-500">We show up and serve the best ice cream in town!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
