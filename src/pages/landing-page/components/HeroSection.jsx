import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../../../components/animations/FadeIn';
import AnimatedButton from '../../../components/animations/AnimatedButton';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

      {/* Animated gradient mesh background - light theme */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white" />
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-200/40 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/40 blur-[100px]"
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-emerald-100/30 blur-[80px]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />
      </motion.div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <motion.div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ opacity }}>
        <div className="space-y-8 md:space-y-10">

          {/* Badge */}
          <FadeIn delay={0.05}>
            <motion.div
              className="inline-flex items-center gap-2.5 bg-violet-50 border border-violet-200/60 text-violet-700 px-5 py-2 rounded-full text-sm font-medium"
              whileHover={{ borderColor: 'rgba(139,92,246,0.5)', backgroundColor: 'rgba(139,92,246,0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Free forever — no credit card needed
            </motion.div>
          </FadeIn>

          {/* Logo */}
          <FadeIn delay={0.15}>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-3xl bg-violet-50 border border-violet-100"
              whileHover={{ scale: 1.05, borderColor: 'rgba(139,92,246,0.4)' }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Icon name="Anchor" size={140} color="var(--color-accent)" className="w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28" />
            </motion.div>
          </FadeIn>

          {/* Headline with gradient */}
          <FadeIn delay={0.25}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight">
              <span className="text-slate-900">Your Bible plan —</span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                tracked, not forgotten.
              </span>
            </h1>
          </FadeIn>

          {/* Subtext */}
          <FadeIn delay={0.35}>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
              Most people start a Bible reading plan and quietly drop it.
              Anchor shows you exactly where you are — and makes it dead simple to pick back up.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-violet-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-violet-200"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 40px rgba(139,92,246,0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <Icon name="BookOpen" size={22} />
                Start Tracking — Free
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 shadow-sm"
                whileHover={{ backgroundColor: '#f8fafc', borderColor: 'rgba(148,163,184,0.5)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <Icon name="ChevronDown" size={22} />
                See How It Works
              </motion.button>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.55}>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-10 border-t border-slate-100">
              {[
                { icon: 'Users', value: '10,000+', label: 'readers on track' },
                { icon: 'BookCheck', value: '50,000+', label: 'plans completed' },
                { icon: 'Star', value: '4.9 / 5', label: 'average rating' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon name={stat.icon} size={18} className="text-violet-500/60" />
                  <span className="text-slate-400 text-sm">
                    <strong className="text-slate-700 font-semibold">{stat.value}</strong>{' '}{stat.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-200 flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 rounded-full bg-slate-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
