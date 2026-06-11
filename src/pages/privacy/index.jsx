import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Icon from '../../components/AppIcon';

const isNative = Capacitor.isNativePlatform();
const homeTo = isNative ? '/onboarding' : '/landing-page';

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — Anchor';
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
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: June 10, 2026</p>

          <div className="prose-custom space-y-10">

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">1. Overview</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Anchor ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed">
                <li><strong className="text-foreground">Account data:</strong> name, email address, and profile photo when you create an account.</li>
                <li><strong className="text-foreground">Usage data:</strong> reading plans, progress records, streaks, and group memberships you create within the Service.</li>
                <li><strong className="text-foreground">Technical data:</strong> browser type, device information, IP address, and cookies necessary for the Service to function.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed">
                <li>To provide and maintain the Service</li>
                <li>To personalize your experience and track your reading progress</li>
                <li>To enable group features and collaboration</li>
                <li>To send important notifications about your account or the Service</li>
                <li>To improve the Service and fix issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Your data is stored securely. We use industry-standard encryption for data in transit and at rest. While no method of electronic storage is 100% secure, we take reasonable measures to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">5. Third-Party Services</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We use the following third-party services, each with their own privacy policies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed mt-3">
                <li><strong className="text-foreground">Firebase (Google):</strong> authentication, data storage, and analytics</li>
                <li><strong className="text-foreground">Google Sign-In:</strong> optional social login — Google may collect data per their privacy policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">6. Data Sharing</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We do not sell your personal data. We share data only when necessary to operate the Service (e.g., displaying your name to group members) or when required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">7. Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed">
                <li><strong className="text-foreground">Access:</strong> you can view the personal data we hold about you</li>
                <li><strong className="text-foreground">Deletion:</strong> you can request deletion of your account and associated data</li>
                <li><strong className="text-foreground">Portability:</strong> you can export your data at any time</li>
                <li><strong className="text-foreground">Opt-out:</strong> you can disable analytics tracking in your browser settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">8. Cookies</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We use only essential cookies required for authentication and session management. We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">9. Children's Privacy</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or a notice within the Service. Your continued use of the Service constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">11. Contact</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                For privacy-related questions or requests, contact us at{' '}
                <a href="mailto:anchor@biblescriptura.com" className="text-accent hover:underline">privacy@biblescriptura.com</a>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-accent transition-gentle">Terms of Service</Link>
            <Link to="/register" className="hover:text-accent transition-gentle">Create Account</Link>
            <Link to="/login" className="hover:text-accent transition-gentle">Sign In</Link>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
};

export default Privacy;
