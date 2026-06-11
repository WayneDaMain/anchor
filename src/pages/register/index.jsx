import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { motion } from 'framer-motion';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';
import Icon from '../../components/AppIcon';

const isNative = Capacitor.isNativePlatform();
const backTo = isNative ? '/onboarding' : '/landing-page';

const perks = [
  { icon: 'Target', text: 'Know exactly where you are in your reading plan' },
  { icon: 'RotateCcw', text: 'Fall behind? Just pick up where you left off' },
  { icon: 'Users', text: 'Read in groups — no spreadsheets required' },
  { icon: 'Share2', text: 'Share beautiful progress reports with anyone' },
];

const Register = () => {
  useEffect(() => {
    document.title = 'Create Account — Anchor';
  }, []);

  return (
    <PageTransition className="min-h-screen bg-background flex">

      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 border-r border-slate-100 flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <Link to={backTo} className="flex items-center space-x-2.5 mb-16">
            <Icon name="Anchor" size={24} className="w-6 h-6 object-contain" />
            <span className="text-base font-bold text-slate-900 tracking-tight font-sans">Anchor</span>
          </Link>

          {/* Headline */}
          <div className="mb-12">
            <h1 className="text-3xl xl:text-4xl font-sans font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
              Start reading. <br />
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                Stop losing your pace.
              </span>
            </h1>
            <p className="text-base text-slate-500 font-light leading-relaxed max-w-sm">
              Anchor tracks your Bible reading progress so you always know where you are, and makes it easy to get back whenever.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-4">
            {perks.map((perk, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex items-start gap-3 select-none"
              >
                <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 bg-white/80 flex-shrink-0 mt-0.5 shadow-2xs">
                  <Icon name={perk.icon} size={10} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-slate-500 leading-snug">{perk.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs font-semibold tracking-wider text-slate-400 uppercase mt-auto select-none">
          100% free · No credit card required
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20 min-h-screen lg:min-h-0 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <Link to={backTo} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Anchor" size={36} color="var(--color-primary)" />
            </div>
            <span className="text-lg font-heading font-semibold text-foreground">Anchor</span>
          </Link>
          <Link to={backTo} className="text-sm text-muted-foreground hover:text-foreground transition-gentle">
            ← Back
          </Link>
        </div>

        <FadeIn delay={0.15}>
          <div className="max-w-md w-full mx-auto">
            {/* Form header */}
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Get started — it's free
              </h2>
              <p className="text-base text-muted-foreground">
                Track your progress. Know where you stand.
              </p>
            </div>

            {/* Social sign-up */}
            <div className="mb-6">
              <SocialRegistration />
            </div>

            {/* Form */}
            <RegistrationForm />

            {/* Sign-in link */}
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-xs text-muted-foreground/60 text-center">
              By signing up you agree to our{' '}
              <Link to="/terms" className="hover:text-accent transition-gentle">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="hover:text-accent transition-gentle">Privacy Policy</Link>.
            </p>
          </div>
        </FadeIn>
      </div>

    </PageTransition>
  );
};

export default Register;