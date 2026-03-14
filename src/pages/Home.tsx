import React from 'react';
import Hero from '@/src/components/Hero';
import Events from '@/src/components/Events';
import Gallery from '@/src/components/Gallery';
import BookingStatusChecker from '@/src/components/BookingStatusChecker';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ASSETS } from '@/src/assets';

const Home = () => {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Event Coordinator',
      content: 'Best Ice Cream was the highlight of our corporate summer bash! Professional, friendly, and the flavors were incredible.',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      name: 'Michael Chen',
      role: 'Parent',
      content: 'Booked them for my son’s 10th birthday. The kids went wild when the truck pulled up. Best decision ever!',
      avatar: 'https://i.pravatar.cc/150?u=michael'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Neighborhood Organizer',
      content: 'We have them come by every month. It’s become a neighborhood tradition that everyone looks forward to.',
      avatar: 'https://i.pravatar.cc/150?u=elena'
    }
  ];

  return (
    <div className="overflow-hidden">
      <Hero />
      
      {/* About Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={ASSETS.spongebob_pop}
              alt="SpongeBob Popsicle"
              className="rounded-[3rem] shadow-2xl bg-slate-50 p-12"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 bg-pink-500 p-8 rounded-[2rem] text-white shadow-xl hidden md:block">
              <p className="text-4xl font-black">10k+</p>
              <p className="text-sm font-medium opacity-80">Treats Served</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
              Chicago's Best <span className="text-pink-500">Frozen Novelties</span> & Drinks.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              We specialize in premium frozen novelty items, popsicles, and refreshing drinks like cold water. Perfect for any outdoor event or celebration!
            </p>
            <ul className="space-y-4 mb-10">
              {['Premium Frozen Novelties', 'Cold Drinks & Water', '24/7 Event Availability', 'Friendly Professional Staff'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                    <Star size={14} fill="currentColor" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/book" className="text-pink-500 font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Learn more about our story <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Events />
      <Gallery />

      {/* Booking Status Check */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Check Your Booking Status</h2>
            <p className="text-slate-500">Enter your booking number to see if your event is confirmed.</p>
          </div>
          <BookingStatusChecker />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">What People Say</h2>
            <p className="text-slate-600">Don't just take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-10 rounded-[2.5rem] relative"
              >
                <Quote className="text-pink-200 absolute top-8 right-8 w-12 h-12" />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-slate-700 italic mb-8 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-pink-500 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-50"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-600 rounded-full blur-3xl opacity-50"
          />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready for a Sweet Surprise?</h2>
            <p className="text-pink-100 text-xl mb-12 max-w-2xl mx-auto">
              Book the Best Ice Cream truck for your next event and make it a day to remember.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book" className="bg-white text-pink-500 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-pink-50 transition-all shadow-xl">
                Book the Truck Now
              </Link>
              <Link to="/contact" className="bg-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-pink-700 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default Home;
