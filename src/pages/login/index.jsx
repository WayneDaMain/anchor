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
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 border-r border-slate-100 flex-col justify-between p-12 xl:p-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10">
          <Link to="/landing-page" className="flex items-center space-x-2.5 mb-16">
            <Icon name="Anchor" size={24} className="w-6 h-6 object-contain" />
            <span className="text-base font-bold text-slate-900 tracking-tight font-sans">Anchor</span>
          </Link>

          <div className="mb-12">
            <h1 className="text-3xl xl:text-4xl font-sans font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
              Welcome back. <br />
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                Your plan is waiting.
              </span>
            </h1>
            <p className="text-base text-slate-500 font-light leading-relaxed max-w-sm">
              Sign in to pick up right where you left off. Your progress, streaks, and groups are all here for you.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-xs font-semibold tracking-wider text-slate-400 uppercase mt-auto select-none">
          100% free · No credit card required
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
