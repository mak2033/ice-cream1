import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ASSETS } from '@/src/assets';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.hero_bg}
          alt="Frozen novelties background"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      {/* Floating Shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-60"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-10 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
            Chicago's Favorite Truck
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8">
            Best <span className="text-pink-500 italic">Ice Cream</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
            Bringing the magic of premium ice cream to your doorstep. Perfect for birthdays, corporate events, and neighborhood celebrations across Chicago.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/book"
              className="group bg-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-pink-600 transition-all hover:shadow-xl hover:shadow-pink-200"
            >
              Book the Truck
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/chat"
              className="bg-white text-slate-900 border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:border-pink-200 hover:bg-pink-50 transition-all"
            >
              Chat With Us
              <MessageCircle className="text-pink-500" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img
              src={ASSETS.spongebob_pop}
              alt="Character Popsicles"
              className="w-full h-auto bg-slate-50 p-8"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200 rounded-full z-0 animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full z-0 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
