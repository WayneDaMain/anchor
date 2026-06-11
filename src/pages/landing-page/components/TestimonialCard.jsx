import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

const TestimonialCard = ({ name, role, image, imageAlt, testimonial, rating }) => {
  return (
    <motion.div
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-7 md:p-8 border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-zinc-750 shadow-sm hover:shadow-md transition-all duration-500"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 dark:from-zinc-850 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-5">
          {[...Array(5)]?.map((_, index) => (
            <Icon
              key={index}
              name="Star"
              size={14}
              className={`w-3.5 h-3.5 ${index < rating ? 'text-blue-500 dark:text-blue-400 fill-current' : 'text-slate-200 dark:text-zinc-850'}`}
            />
          ))}
        </div>

        <p className="text-sm md:text-base text-slate-600 dark:text-zinc-300 mb-7 leading-relaxed font-light">
          "{testimonial}"
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-100 dark:ring-zinc-800">
            <Image
              src={image}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{name}</h4>
            <p className="text-xs text-slate-400 dark:text-zinc-550 font-light">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
