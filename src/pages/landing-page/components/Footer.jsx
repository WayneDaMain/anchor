import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/landing-page#features' },
      { label: 'Reading Plans', path: '/plan-creation-wizard' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ]
  };

  const ecosystemProducts = [
    {
      name: 'Scriptura',
      description: 'Read the Bible online',
      url: 'https://biblescriptura.com',
      logo: '/scriptura.png',
    },
    {
      name: 'Folio',
      description: 'Bible journaling',
      url: 'https://folio.biblescriptura.com',
      logo: '/folio.png',
    },
  ];

  return (
    <footer className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-12">
          <div className="lg:col-span-2">
            <Link to="/landing-page" className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Icon name="Anchor" size={58} color="#60a5fa" />
              </div>
              <div>
                <span className="text-xl font-heading font-semibold text-white block">Anchor</span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Bible progress, simplified.</span>
              </div>
            </Link>
            <p className="text-sm md:text-base text-slate-400 mb-4 md:mb-6 leading-relaxed">
              The Bible reading tracker built for people who mean it.
            </p>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Product</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.product?.map((link) => (
                <li key={link?.label}>
                  {link.path.includes('#') ? (
                    <a
                      href={link.path}
                      className="text-sm md:text-base text-slate-400 hover:text-blue-400 transition-gentle"
                    >
                      {link?.label}
                    </a>
                  ) : (
                    <Link
                      to={link?.path}
                      className="text-sm md:text-base text-slate-400 hover:text-blue-400 transition-gentle"
                    >
                      {link?.label}
                    </Link>
                  )}
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
                    className="text-sm md:text-base text-slate-400 hover:text-blue-400 transition-gentle"
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
                    className="text-sm md:text-base text-slate-400 hover:text-blue-400 transition-gentle"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs md:text-sm text-slate-500 text-center md:text-left order-2 md:order-1">
            &copy; {currentYear} Anchor. All rights reserved.
          </p>

          {/* Powered by Scriptura ecosystem */}
          <div className="flex flex-col items-center md:items-end gap-2.5 order-1 md:order-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Part of the Scriptura Ecosystem
            </span>
            <div className="flex items-center gap-4">
              {ecosystemProducts.map(product => (
                <a
                  key={product.name}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700 transition-all group"
                  title={product.description}
                >
                  <img
                    src={product.logo}
                    alt={product.name}
                    className="h-5 w-5 object-contain rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {product.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
