import React from 'react';
import { Mail, Phone, Clock, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

const Contact = () => {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-600">We're here to answer any questions you have about our services.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                <input
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  placeholder="(312) 555-0123"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none"
                  placeholder="Tell us about your event..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 flex items-center justify-center gap-2"
              >
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="bg-pink-100 p-4 rounded-2xl text-pink-500">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                <p className="text-slate-600">(312) 555-0123</p>
                <p className="text-xs text-slate-400 mt-1">Available for urgent event inquiries</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="bg-blue-100 p-4 rounded-2xl text-blue-500">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                <p className="text-slate-600">hello@besticecream.com</p>
                <p className="text-xs text-slate-400 mt-1">We respond within 24 hours</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-500">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Operating Hours</h3>
                <p className="text-slate-600">Open 24/7 for Events</p>
                <p className="text-xs text-slate-400 mt-1">Chicago & Surrounding Suburbs</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="bg-amber-100 p-4 rounded-2xl text-amber-500">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Service Area</h3>
                <p className="text-slate-600">Greater Chicago Area</p>
                <p className="text-xs text-slate-400 mt-1">Including Naperville, Evanston, & Oak Park</p>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <a href="#" className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-pink-500 hover:border-pink-200 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-pink-500 hover:border-pink-200 transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-pink-500 hover:border-pink-200 transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
