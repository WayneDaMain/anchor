import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Icon from '../../components/AppIcon';

const isNative = Capacitor.isNativePlatform();
const homeTo = isNative ? '/onboarding' : '/landing-page';

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms of Service — Anchor';
  }, []);

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Anchor" size={36} color="var(--color-primary)" />
            </div>
            <span className="text-lg font-heading font-semibold text-foreground">Anchor</span>
          </Link>
          <Link to={homeTo} className="text-sm text-muted-foreground hover:text-foreground transition-gentle">
            ← Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <FadeIn delay={0.1}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: June 10, 2026</p>

          <div className="prose-custom space-y-10">
            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                By accessing or using Anchor ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Anchor is a free Bible reading tracker that helps you create reading plans, track your progress, and collaborate with others in groups. The Service is provided "as is" and is available at no cost.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">3. User Accounts</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must be at least 13 years of age to use this Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">4. Acceptable Use</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                You agree not to misuse the Service, including but not limited to: attempting to access unauthorized areas, transmitting harmful code, harassing other users, or using the Service for any illegal purpose. We reserve the right to suspend accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">5. Intellectual Property</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                All content, branding, and code comprising the Service are owned by Anchor and are protected by applicable intellectual property laws. Bible text content displayed in the Service is sourced from publicly available translations and remains the property of their respective publishers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">6. User Content</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                You retain ownership of any content you submit to the Service (such as profile photos or group messages). By submitting content, you grant Anchor a non-exclusive, worldwide license to use, display, and distribute your content within the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Anchor shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">8. Service Availability</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We strive to keep the Service available 24/7 but do not guarantee uninterrupted access. The Service may be temporarily unavailable for maintenance, updates, or due to circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">9. Changes to Terms</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We may update these Terms at any time. We will notify you of material changes via email or a notice within the Service. Continued use of the Service after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">10. Contact</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please contact us at{' '}
                <a href="mailto:anchor@biblescriptura.com" className="text-accent hover:underline">support@biblescriptura.com</a>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-accent transition-gentle">Privacy Policy</Link>
            <Link to="/register" className="hover:text-accent transition-gentle">Create Account</Link>
            <Link to="/login" className="hover:text-accent transition-gentle">Sign In</Link>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default Terms;
