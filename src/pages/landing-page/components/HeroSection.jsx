import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeIn from '../../../components/animations/FadeIn';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [streakCount, setStreakCount] = useState(12);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleCheckboxChange = () => {
    if (isChecked) {
      setIsChecked(false);
      setStreakCount(12);
    } else {
      setIsChecked(true);
      setStreakCount(13);
    }
  };

  // Math for the SVG progress circle
  // Radius = 26. Circumference = 2 * PI * 26 = 163.36
  const strokeDasharray = 163.36;
  const initialOffset = strokeDasharray * (1 - 2 / 3); // 2/3 complete initially = 54.45
  const completedOffset = 0; // 3/3 complete = 0

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Exquisite Subtle Spotlight Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white dark:from-zinc-900/40 dark:via-zinc-950 dark:to-zinc-950" />
        {/* Architectural grid lines */}
        <div className="absolute inset-y-0 top-0 h-full max-w-7xl mx-auto border-x border-slate-100/70 dark:border-zinc-900/70" />
        <div className="absolute top-[88px] inset-x-0 border-t border-slate-100/70 dark:border-zinc-900/70" />
      </div>

      {/* Minimalist Top Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 h-[88px] flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Icon name="Anchor" size={24} className="w-6 h-6 object-contain" />
          <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight font-sans">Anchor</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-450 dark:hover:text-zinc-100 transition-all duration-200 font-medium cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-450 dark:hover:text-zinc-100 transition-all duration-200 font-medium cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => navigate('/about')}
            className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-450 dark:hover:text-zinc-100 transition-all duration-200 font-medium cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-450 dark:hover:text-zinc-100 transition-all duration-200 font-medium cursor-pointer"
          >
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all duration-200 flex items-center justify-center cursor-pointer bg-white/50 dark:bg-zinc-900/50"
            aria-label="Toggle Theme"
          >
            <Icon name={isDark ? 'Sun' : 'Moon'} size={15} />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all duration-200 font-medium px-2 py-1 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-xs font-semibold text-slate-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-800 dark:hover:border-zinc-400 rounded-full px-5 py-2 transition-all duration-250 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 flex-grow flex items-center py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left max-w-2xl">

            <FadeIn delay={0.15} direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-sans font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.1]">
                Your Bible plan. <br />
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-zinc-50 dark:via-zinc-350 dark:to-zinc-500 bg-clip-text text-transparent">
                  Tracked, not forgotten.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.25} direction="up">
              <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 font-light leading-relaxed max-w-xl">
                Most people start a Bible reading plan and quietly drop it. Anchor makes reading progress dead simple to track, so you can build a consistent habit with zero friction.
              </p>
            </FadeIn>

            <FadeIn delay={0.35} direction="up">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 group shadow-sm hover:shadow hover:scale-[1.01] cursor-pointer"
                >
                  <span>Start tracking for free</span>
                  <Icon name="ArrowRight" size={16} className="text-white/80 dark:text-zinc-950/80 group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
                
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold text-sm px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>See how it works</span>
                  <Icon name="ChevronDown" size={16} className="text-slate-500 group-hover:translate-y-0.5 transition-all duration-200" />
                </button>
              </div>
            </FadeIn>

            {/* Architectural Stats Section */}
            <FadeIn delay={0.45} direction="up">
              <div className="pt-8 border-t border-slate-100 dark:border-zinc-900 flex items-center gap-8 sm:gap-12 select-none">
                {[
                  { value: '10k+', label: 'Active Readers' },
                  { value: '50k+', label: 'Completed Plans' },
                  { value: '4.9/5', label: 'App Rating' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-zinc-50 tracking-tight">{stat.value}</div>
                    <div className="text-xs text-slate-400 dark:text-zinc-550 font-semibold tracking-wider uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Interactive Demo Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <FadeIn delay={0.2} direction="up" className="w-full max-w-[360px]">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
              >
                {/* Accent glow on card hover */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-slate-50 dark:bg-zinc-850/50 blur-2xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center text-xs font-semibold font-sans tracking-wide">
                      JK
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 block leading-tight">James K.</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-normal leading-tight">Bible Chronological</span>
                    </div>
                  </div>
                  
                  <motion.div
                    key={streakCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`border px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${isChecked
                        ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-455'
                        : 'bg-slate-50 border-slate-100 dark:bg-zinc-800/40 dark:border-zinc-800 text-slate-500 dark:text-zinc-400'
                      }`}
                  >
                    <Icon name="Zap" size={10} className={isChecked ? 'text-emerald-500 fill-emerald-500' : 'text-slate-400'} />
                    <span>Streak: {streakCount}d</span>
                  </motion.div>
                </div>

                <div className="border-b border-slate-100 dark:border-zinc-800 my-4" />

                {/* Card Body */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-zinc-500 uppercase block">Today's Goal</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-zinc-50 mt-0.5 tracking-tight block">Luke 4 — 6</span>
                  </div>

                  {/* Circular Radial Progress */}
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="stroke-slate-100 dark:stroke-zinc-800"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="stroke-slate-900 dark:stroke-zinc-100"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        animate={{ strokeDashoffset: isChecked ? completedOffset : initialOffset }}
                        transition={{ type: "spring", stiffness: 90, damping: 15 }}
                      />
                    </svg>
                    <div className="absolute text-xs font-bold text-slate-900 dark:text-zinc-100 tracking-tighter">
                      {isChecked ? "100%" : "66%"}
                    </div>
                  </div>
                </div>

                {/* Subtext description */}
                <div className="mt-4 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-xl p-3">
                  <div className="flex items-center justify-between text-2xs text-slate-400 dark:text-zinc-500 font-medium">
                    <span>PROGRESS</span>
                    <span>{isChecked ? '3 of 3 tasks' : '2 of 3 tasks'}</span>
                  </div>
                  
                  {/* Small progress meter bar */}
                  <div className="w-full h-1 bg-slate-200 dark:bg-zinc-750 rounded-full mt-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-slate-900 dark:bg-zinc-100"
                      animate={{ width: isChecked ? '100%' : '66.6%' }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    />
                  </div>
                </div>

                {/* Checklist */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">
                    <span>Reading List</span>
                    <span className="text-slate-300 dark:text-zinc-650">Click to track</span>
                  </div>

                  {/* Checked items */}
                  <div className="flex items-center gap-3 py-1 text-slate-400 dark:text-zinc-500 text-sm line-through">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Icon name="Check" size={11} strokeWidth={3} />
                    </div>
                    <span className="font-medium">Luke 4</span>
                  </div>

                  <div className="flex items-center gap-3 py-1 text-slate-400 dark:text-zinc-500 text-sm line-through">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Icon name="Check" size={11} strokeWidth={3} />
                    </div>
                    <span className="font-medium">Luke 5</span>
                  </div>

                  {/* Interactive Item */}
                  <div
                    onClick={handleCheckboxChange}
                    className="flex items-center gap-3 py-1 cursor-pointer group select-none"
                  >
                    <div className="relative flex-shrink-0">
                      {/* Checkbox ripple animation */}
                      {isChecked && (
                        <div
                          className="absolute inset-0 rounded-full bg-emerald-500/30"
                          style={{
                            animation: 'ripple 0.6s cubic-bezier(0, 0, 0.2, 1) forwards'
                          }}
                        />
                      )}
                      <motion.div
                        animate={{ scale: isChecked ? 1.05 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-zinc-700 group-hover:border-slate-800 dark:group-hover:border-zinc-500 bg-white dark:bg-zinc-900'
                          }`}
                      >
                        {isChecked ? (
                          <Icon name="Check" size={11} strokeWidth={3} />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.div>
                    </div>
                    
                    <span className={`text-sm font-semibold transition-all duration-200 ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-zinc-200 group-hover:text-slate-900 dark:group-hover:text-zinc-100'
                      }`}>
                      Luke 6
                    </span>
                    
                    {isChecked && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 px-1.5 py-0.2 rounded ml-auto"
                      >
                        Logged!
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* CSS styles inside React for custom keyframe animations */}
                <style>{`
                  @keyframes ripple {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.4); opacity: 0; }
                  }
                `}</style>

              </motion.div>
            </FadeIn>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Line (fades out at edges) */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-zinc-900" />
    </section>
  );
};

export default HeroSection;
