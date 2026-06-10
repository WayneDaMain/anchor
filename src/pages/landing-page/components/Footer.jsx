import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/landing-page#features' },
      { label: 'Reading Plans', path: '/plan-creation-wizard' },
      { label: 'Groups', path: '/group-management' }
    ],
    company: [
      { label: 'About Us', path: '/landing-page' },
      { label: 'Blog', path: '/landing-page' },
      { label: 'Careers', path: '/landing-page' },
      { label: 'Contact', path: '/landing-page' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/landing-page' },
      { label: 'GDPR', path: '/landing-page' }
    ],
    support: [
      { label: 'Help Center', path: '/landing-page' },
      { label: 'Community', path: '/landing-page' },
      { label: 'Status', path: '/landing-page' },
      { label: 'API Docs', path: '/landing-page' }
    ]
  };

  const socialLinks = [
    { icon: 'Facebook', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'Twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'Instagram', url: 'https://instagram.com', label: 'Instagram' },
    { icon: 'Youtube', url: 'https://youtube.com', label: 'YouTube' }
  ];

  return (
    <footer className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-12">
          <div className="lg:col-span-2">
            <Link to="/landing-page" className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-14 h-14 bg-violet-600/20 rounded-xl flex items-center justify-center">
                <Icon name="Anchor" size={58} color="#a78bfa" />
              </div>
              <div>
                <span className="text-xl font-heading font-semibold text-white block">Anchor</span>
                <span className="text-xs text-slate-400 tracking-widest uppercase">Bible Reading Tracker</span>
              </div>
            </Link>
            <p className="text-sm md:text-base text-slate-400 mb-4 md:mb-6 leading-relaxed">
              The Bible reading tracker built for people who mean it.
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.label}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-violet-600 text-slate-400 hover:text-white transition-gentle"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={18} className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Product</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.product?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm md:text-base text-slate-400 hover:text-violet-400 transition-gentle"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.company?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm md:text-base text-slate-400 hover:text-violet-400 transition-gentle"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Legal</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.legal?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm md:text-base text-slate-400 hover:text-violet-400 transition-gentle"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.support?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm md:text-base text-slate-400 hover:text-violet-400 transition-gentle"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-slate-500 text-center md:text-left">
              &copy; {currentYear} Anchor. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} color="#10b981" className="w-4 h-4" />
                <span className="text-xs md:text-sm text-slate-500">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Lock" size={16} color="#10b981" className="w-4 h-4" />
                <span className="text-xs md:text-sm text-slate-500">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
