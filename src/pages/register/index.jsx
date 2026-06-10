import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';
import Icon from '../../components/AppIcon';

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
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-background to-accent/10 flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        {/* Glow */}
        <motion.div
          className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/landing-page" className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Anchor" size={44} color="var(--color-primary)" />
            </div>
            <span className="text-xl font-heading font-semibold text-foreground">Anchor</span>
          </Link>

          {/* Headline */}
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-heading font-bold text-foreground leading-[1.15] mb-5">
              Start reading.
              <br />
              <span className="text-accent">Stop losing your place.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Anchor tracks your Bible reading progress so you always know where you are — and makes it easy to get back when life gets in the way.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-5">
            {perks.map((perk, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name={perk.icon} size={18} color="var(--color-accent)" />
                </div>
                <span className="text-base text-foreground/80 leading-snug">{perk.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-sm text-muted-foreground/60 mt-auto">
          100% free · No credit card · No pressure
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20 min-h-screen lg:min-h-0 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <Link to="/landing-page" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Anchor" size={36} color="var(--color-primary)" />
            </div>
            <span className="text-lg font-heading font-semibold text-foreground">Anchor</span>
          </Link>
          <Link to="/landing-page" className="text-sm text-muted-foreground hover:text-foreground transition-gentle">
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