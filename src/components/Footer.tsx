import React from 'react';
import { Link } from 'react-router-dom';
import { IceCream, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-pink-500 p-2 rounded-xl">
              <IceCream className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Best <span className="text-pink-500">Ice Cream</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            Chicago's favorite ice-cream truck, bringing joy and sweetness to every neighborhood, party, and event.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
            <li><Link to="/book" className="hover:text-pink-500 transition-colors">Book the Truck</Link></li>
            <li><Link to="/chat" className="hover:text-pink-500 transition-colors">Chat With Us</Link></li>
            <li><Link to="/contact" className="hover:text-pink-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-pink-500" />
              <span>(312) 555-0123</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-pink-500" />
              <span>hello@besticecream.com</span>
            </li>
            <li>Chicago, IL & Suburbs</li>
            <li>Available 24/7 for Events</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Newsletter</h4>
          <p className="text-sm mb-4">Stay updated with our latest stops and flavors!</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-xs">
        <p>© {new Date().getFullYear()} Best Ice Cream Chicago. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
