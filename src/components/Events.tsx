import React from 'react';
import { motion } from 'motion/react';
import { Cake, School, Briefcase, Home } from 'lucide-react';

const Events = () => {
  const eventTypes = [
    {
      title: 'Birthday Parties',
      description: 'Make their special day unforgettable with a surprise visit from our truck.',
      icon: <Cake className="w-8 h-8 text-pink-500" />,
      color: 'bg-pink-50',
    },
    {
      title: 'School Events',
      description: 'The perfect treat for field days, graduations, and school fundraisers.',
      icon: <School className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Corporate Events',
      description: 'Boost office morale with a premium ice cream break for your team.',
      icon: <Briefcase className="w-8 h-8 text-emerald-500" />,
      color: 'bg-emerald-50',
    },
    {
      title: 'Neighborhood Stops',
      description: 'Bringing the community together with frozen treats and ice-cold water.',
      icon: <Home className="w-8 h-8 text-amber-500" />,
      color: 'bg-amber-50',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Events We Serve</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Whether it's a small gathering or a massive festival, we bring the flavor and the fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2.5rem] border border-slate-100 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-50 transition-all"
            >
              <div className={`${event.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {event.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{event.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {event.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
