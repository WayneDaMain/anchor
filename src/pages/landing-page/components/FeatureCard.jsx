import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeatureCard = ({ icon, title, description, accentColor = false, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-zinc-900/60 border border-violet-100 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-violet-300 dark:group-hover:border-zinc-600 transition-colors duration-300">
            <Icon
              name={icon}
              size={20}
              className={`w-5 h-5 ${accentColor ? 'text-violet-600 dark:text-blue-400' : 'text-slate-500 dark:text-zinc-455'}`}
            />
          </div>
          <h3 className="text-base md:text-lg font-heading font-bold text-slate-900 dark:text-zinc-100 leading-snug pt-1.5">
            {title}
          </h3>
        </div>
        {/* Violet accent line */}
        <div className="w-12 h-[2px] bg-gradient-to-r from-violet-500 to-violet-300 dark:from-blue-500 dark:to-blue-300 rounded-full mb-4 ml-14" />
        <p className="text-sm md:text-[15px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light pl-14">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
