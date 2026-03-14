import React from 'react';
import { motion } from 'motion/react';
import { ASSETS } from '@/src/assets';

const Gallery = () => {
  const images = [
    {
      url: ASSETS.spongebob_pop,
      title: 'SpongeBob Pop',
      category: 'Character Pops'
    },
    {
      url: ASSETS.spiderman_pop,
      title: 'Spider-Man Bar',
      category: 'Character Pops'
    },
    {
      url: ASSETS.oreo_sandwich,
      title: 'Oreo Sandwich',
      category: 'Novelties'
    },
    {
      url: ASSETS.strawberry_shortcake,
      title: 'Strawberry Shortcake',
      category: 'Novelties'
    },
    {
      url: ASSETS.bomb_pop,
      title: 'Original Bomb Pop',
      category: 'Rocket Pops'
    },
    {
      url: ASSETS.water_bottle,
      title: 'Ice Cold Water',
      category: 'Drinks'
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Sweet Moments</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A glimpse into the joy we bring to Chicago neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-2">{img.category}</span>
                <h3 className="text-white text-xl font-bold">{img.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
