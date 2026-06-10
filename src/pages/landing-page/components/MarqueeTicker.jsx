import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

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
    <div className="w-full overflow-hidden bg-slate-50 border-y border-slate-100 py-5">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {allItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 flex-shrink-0">
            <Icon name={item.icon} size={14} className="text-violet-500/60" />
            <span className="text-sm text-slate-500 font-medium tracking-wide">{item.text}</span>
            <span className="ml-8 text-slate-200 text-xs">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeTicker;
