import React from 'react';
import { motion } from 'framer-motion';

const items = [
  { icon: 'BookOpen', text: 'Genesis → Revelation' },
  { icon: 'CheckCircle', text: '50,000+ plans finished' },
  { icon: 'Users', text: 'Read in groups' },
  { icon: 'Bell', text: 'Smart reminders' },
  { icon: 'BarChart2', text: 'Visual progress reports' },
  { icon: 'Smartphone', text: 'Works on any device' },
  { icon: 'Zap', text: 'Set up in 2 minutes' },
  { icon: 'Lock', text: 'Private & secure' },
];

const allItems = [...items, ...items];

const MarqueeTicker = () => {
  return (
    <div className="w-full overflow-hidden bg-slate-50 dark:bg-zinc-900 border-y border-slate-100 dark:border-zinc-800 transition-colors duration-300 py-3 sm:py-5">
      <motion.div
        className="flex gap-6 sm:gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {allItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">{item.text}</span>
            <span className="ml-4 sm:ml-8 text-slate-200 dark:text-zinc-800 text-xs">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeTicker;
