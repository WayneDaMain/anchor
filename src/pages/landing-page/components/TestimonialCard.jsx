import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

const TestimonialCard = ({ name, role, image, imageAlt, testimonial, rating }) => {
  return (
    <motion.div
      className="group relative bg-white rounded-2xl p-7 md:p-8 border border-slate-100 hover:border-violet-200 shadow-sm hover:shadow-md transition-all duration-500"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-5">
          {[...Array(5)]?.map((_, index) => (
            <Icon
              key={index}
              name="Star"
              size={14}
              className={`w-3.5 h-3.5 ${index < rating ? 'text-violet-500 fill-current' : 'text-slate-200'}`}
            />
          ))}
        </div>

        <p className="text-sm md:text-base text-slate-600 mb-7 leading-relaxed font-light">
          "{testimonial}"
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-100">
            <Image
              src={image}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{name}</h4>
            <p className="text-xs text-slate-400 font-light">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
