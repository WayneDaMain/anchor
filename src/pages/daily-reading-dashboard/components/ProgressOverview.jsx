import React from 'react';
import { motion } from 'framer-motion';

const ProgressOverview = ({ planData, progressStats, onClick }) => {
  const progressPercentage = planData?.totalDays
    ? Math.round((progressStats?.daysCompleted / planData?.totalDays) * 100)
    : 0;

  const stats = [
    { label: 'Days Done', value: progressStats?.daysCompleted },
    { label: 'Remaining', value: (planData?.totalDays || 0) - (progressStats?.daysCompleted || 0) },
    { label: 'Books', value: progressStats?.booksCompleted },
    { label: 'Chapters', value: progressStats?.chaptersCompleted },
  ];

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl border border-border p-5 shadow-sm ${
        onClick
          ? 'cursor-pointer hover:border-accent/30 hover:shadow-md transition-all active:scale-[0.99] select-none'
          : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-heading font-bold text-foreground">Progress</h2>
        <span className="text-2xl font-heading font-extrabold text-accent leading-none">{progressPercentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">Overall plan completion</p>
      </div>

      {/* 2x2 stat grid — no icons */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map(stat => (
          <div key={stat.label} className="bg-muted/30 rounded-xl p-3 border border-border/40">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-heading font-extrabold text-foreground leading-none">
              {stat.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;
