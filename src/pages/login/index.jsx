import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import LoginForm from './components/LoginForm';
import SocialRegistration from '../register/components/SocialRegistration';
import Icon from '../../components/AppIcon';

const Login = () => {
  useEffect(() => {
    document.title = 'Sign In — Anchor';
  }, []);

  return (
    <PageTransition className="min-h-screen bg-background flex">

      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-background to-accent/10 flex-col justify-between p-12 xl:p-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10">
          <Link to="/landing-page" className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Anchor" size={44} color="var(--color-primary)" />
            </div>
            <span className="text-xl font-heading font-semibold text-foreground">Anchor</span>
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-heading font-bold text-foreground leading-[1.15] mb-5">
              Welcome back.
              <br />
              <span className="text-accent">Your plan is waiting.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Sign in to pick up right where you left off. Your progress, streaks, and groups are all here for you.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-sm text-muted-foreground/60 mt-auto">
          100% free · No credit card · No pressure
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20 min-h-screen lg:min-h-0 overflow-y-auto">
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
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Sign in to Anchor
              </h2>
              <p className="text-base text-muted-foreground">
                Continue your reading journey.
              </p>
            </div>

            <div className="mb-6">
              <SocialRegistration />
            </div>

            <LoginForm />

            <p className="mt-6 text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:underline font-medium">
                Create one free
              </Link>
            </p>

            <p className="mt-4 text-xs text-muted-foreground/60 text-center">
              By signing in you agree to our{' '}
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

export default Login;
