import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { motion } from 'framer-motion';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const isNative = Capacitor.isNativePlatform();
const backTo = isNative ? '/onboarding' : '/landing-page';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password — Anchor';
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess(false);

    if (!email?.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg =
        err.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : 'Failed to send reset email. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <FadeIn delay={0.1}>
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
            <Link to={backTo} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Anchor" size={44} color="var(--color-primary)" />
              </div>
              <span className="text-xl font-heading font-semibold text-foreground">Anchor</span>
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-sm border border-border">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Icon name="KeyRound" size={28} color="var(--color-accent)" />
              </div>
            </div>

            <h1 className="text-2xl font-heading font-bold text-foreground text-center mb-2">
              Forgot your password?
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              No worries — enter your email and we'll send you a link to reset it.
            </p>

            {success ? (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                  <Icon name="CheckCircle" size={16} />
                  Reset email sent!
                </div>
                <p className="text-sm text-muted-foreground">
                  Check <strong className="text-foreground">{email}</strong> for a password reset link. It may take a minute to arrive.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-medium"
                >
                  ← Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    <Icon name="AlertCircle" size={16} />
                    {error}
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e?.target?.value);
                    if (error) setError('');
                  }}
                  required
                />

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-gentle"
                  >
                    ← Back to sign in
                  </Link>
                </div>
              </form>
            )}
          </div>

          <p className="mt-6 text-xs text-muted-foreground/60 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default ForgotPassword;
