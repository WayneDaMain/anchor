import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ planData, progressStats, onClick }) => {
  const progressPercentage = planData?.totalDays
    ? Math.round((progressStats?.daysCompleted / planData?.totalDays) * 100)
    : 0;

  const currentStreak = progressStats?.currentStreak || 0;

  // Math for the SVG progress circle
  // Radius = 26. Circumference = 2 * PI * 26 = 163.36
  const strokeDasharray = 163.36;
  const strokeDashoffset = strokeDasharray * (1 - progressPercentage / 100);

  // Extract initials of active plan name
  const planInitials = planData?.name
    ? planData.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'PR';

  const stats = [
    { label: 'Days Completed', value: `${progressStats?.daysCompleted || 0} days`, icon: 'Check' },
    { label: 'Days Remaining', value: `${(planData?.totalDays || 0) - (progressStats?.daysCompleted || 0)} days`, icon: 'Calendar' },
    { label: 'Books Finished', value: `${progressStats?.booksCompleted || 0} books`, icon: 'BookOpen' },
    { label: 'Chapters Logged', value: `${progressStats?.chaptersCompleted || 0} chapters`, icon: 'BookCheck' },
  ];

  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/80 ${onClick
          ? 'cursor-pointer active:scale-[0.99] select-none'
          : 'select-none'
        }`}
    >
      {/* Accent glow on hover */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-slate-50 dark:bg-zinc-900/40 blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1c142c] text-white dark:bg-[#7c3aed] flex items-center justify-center text-xs font-bold tracking-wide">
            {planInitials}
          </div>
          <div>
            <span className="text-xs font-extrabold text-foreground block leading-tight">
              {planData?.name || 'Active Plan'}
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium leading-tight">
              Overall Progress
            </span>
          </div>
        </div>

        {/* Streak Badge */}
        <div
          className={`border px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all duration-200 ${currentStreak > 0
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
              : 'bg-muted border-border text-muted-foreground'
            }`}
        >
          <span>Streak: {currentStreak}d</span>
        </div>
      </div>

      <div className="border-b border-border my-4" />

      {/* Card Body */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase block">
            Plan Progress
          </span>
          <span className="text-3xl font-extrabold text-foreground mt-0.5 tracking-tight block">
            {progressPercentage}%
          </span>
        </div>

        {/* Circular Radial Progress */}
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              className="stroke-muted/40 dark:stroke-zinc-800"
              strokeWidth="3.5"
              fill="transparent"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="26"
              className="stroke-slate-900 dark:stroke-accent"
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ type: 'spring', stiffness: 90, damping: 15 }}
            />
          </svg>
          <div className="absolute text-xs font-bold text-foreground tracking-tighter">
            {progressPercentage}%
          </div>
        </div>
      </div>

      {/* Progress meter bar */}
      <div className="mt-4 bg-muted/30 border border-border/60 rounded-xl p-3">
        <div className="flex items-center justify-between text-2xs text-muted-foreground font-semibold">
          <span>COMPLETION</span>
          <span>
            {progressStats?.daysCompleted || 0} of {planData?.totalDays || 0} days
          </span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-slate-900 dark:bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      </div>

      {/* Checklist Stats */}
      <div className="mt-5 space-y-2">
        <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
          Plan Breakdown
        </div>

        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-1 text-sm transition-all duration-200 hover:translate-x-0.5 group"
          >
            <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover:border-foreground group-hover:text-foreground transition-colors">
              <Icon name={stat.icon} size={11} strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.label}
            </span>
            <span className="text-foreground font-bold ml-auto">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;
