import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';

const slides = [
  {
    tagline: 'Welcome to Anchor',
    title: (
      <>
        Your Bible plan.{' '}
        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
          Tracked, not forgotten.
        </span>
      </>
    ),
    description:
      'Most people start a Bible reading plan and quietly drop it. Anchor keeps you on track with daily reminders, progress insights, and accountability tools.',
    visual: (
      <div className="relative w-64 h-64 mx-auto">
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full border border-slate-100" />
        <div className="absolute inset-4 rounded-full border border-slate-100" />
        <div className="absolute inset-8 rounded-full border border-slate-100" />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Icon name="Anchor" size={48} className="w-12 h-12" />
          </div>
        </div>
        {/* Floating badges */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 right-6 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-md flex items-center gap-2"
        >
          <span className="text-xs font-semibold text-slate-700">Daily Reading</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-8 left-2 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-md flex items-center gap-2"
        >
          <span className="text-xs font-semibold text-slate-700">Streak: 12 days</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-20 left-0 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-md flex items-center gap-2"
        >
          <span className="text-xs font-semibold text-slate-700">Progress logged</span>
        </motion.div>
      </div>
    ),
  },
  {
    tagline: 'Track Your Progress',
    title: (
      <>
        See exactly where{' '}
        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
          you stand.
        </span>
      </>
    ),
    description:
      'Beautiful dashboards show your daily assignments, completion streaks, and overall plan progress — all at a glance.',
    visual: (
      <div className="w-72 mx-auto space-y-3">
        {/* Progress card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              2 of 3 done
            </span>
          </div>
          {['Luke 4', 'Luke 5', 'Luke 6'].map((chapter, i) => {
            const done = i < 2;
            return (
              <div key={chapter} className="flex items-center gap-3 py-1.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-200'
                  }`}
                >
                  {done && <Icon name="Check" size={11} strokeWidth={3} />}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    done ? 'text-slate-400 line-through' : 'text-slate-800'
                  }`}
                >
                  {chapter}
                </span>
              </div>
            );
          })}
          {/* Progress bar */}
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '66%' }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-slate-900 rounded-full"
            />
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
            <Icon name="Flame" size={18} className="text-orange-500 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900 leading-tight">12</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Day Streak</div>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
            <Icon name="CalendarCheck" size={18} className="text-slate-700 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900 leading-tight">84%</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completion</div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    tagline: 'Stay Accountable',
    title: (
      <>
        Read together.{' '}
        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
          Grow together.
        </span>
      </>
    ),
    description:
      'Create or join a group, share the same reading plan, and see each other\'s progress. Accountability makes all the difference.',
    visual: (
      <div className="w-72 mx-auto space-y-3">
        {/* Group card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Icon name="Users" size={18} className="text-slate-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Morning Devotionals</div>
              <div className="text-xs text-slate-400">5 members · Chronological Plan</div>
            </div>
          </div>
          {/* Member avatars */}
          <div className="flex items-center -space-x-2 mb-3">
            {['JK', 'AM', 'SR', 'TP', 'LM'].map((initials, i) => (
              <div
                key={initials}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{
                  backgroundColor: ['#334155', '#475569', '#64748b', '#0f172a', '#1e293b'][i],
                  zIndex: 5 - i,
                }}
              >
                {initials}
              </div>
            ))}
          </div>
          {/* Activity preview */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            {[
              { name: 'James K.', text: 'completed Luke 4', icon: 'CheckCircle', color: 'text-emerald-500' },
              { name: 'Anna M.', text: 'started Luke 5', icon: 'PlayCircle', color: 'text-slate-500' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <Icon name={item.icon} size={12} className={item.color} />
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="text-slate-400">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <Icon name="Bell" size={16} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Daily reminder at 7 AM</div>
            <div className="text-[10px] text-slate-400">Never miss a reading day</div>
          </div>
        </motion.div>
      </div>
    ),
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    document.title = 'Anchor — Get Started';
  }, []);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const next = () => {
    if (current < slides.length - 1) goTo(current + 1);
    else navigate('/login');
  };

  const prev = () => {
    if (current > 0) goTo(current - 1);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Icon name="Anchor" size={22} className="w-[22px] h-[22px]" />
          <span className="text-sm font-bold text-slate-900 tracking-tight font-sans">Anchor</span>
        </div>
        {current > 0 && (
          <button
            onClick={prev}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-1"
          >
            Back
          </button>
        )}
        {!current && <div className="w-12" />}
      </header>

      {/* Slides */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) prev();
            }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            {/* Visual */}
            <div className="mb-8 w-full">{slide.visual}</div>

            {/* Tagline */}
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
              {slide.tagline}
            </p>

            {/* Title */}
            <h1 className="text-2xl font-sans font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-slate-500 font-light leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-6 pb-8 pt-2 space-y-5">
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 bg-slate-900'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={next}
          className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
        >
          <span>{isLast ? 'Get Started' : 'Continue'}</span>
          <Icon name="ArrowRight" size={16} className="text-white/80" />
        </button>

        {/* Skip link */}
        {!isLast && (
          <button
            onClick={() => navigate('/login')}
            className="w-full text-center text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors py-1"
          >
            Skip to sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
