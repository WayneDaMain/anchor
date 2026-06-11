import React from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const isNative = Capacitor.isNativePlatform();

  const footerLinks = [
    ...(isNative ? [] : [{ label: 'Download Anchor App', path: '/Anchor.apk', download: true }]),
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

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
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top row: nav + legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Brand */}
          <Link to="/daily-reading-dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/anchor.png" alt="Anchor" className="h-7 w-7 object-contain" />
            <span className="text-base font-heading font-extrabold text-foreground tracking-tight">Anchor</span>
          </Link>

          {/* Footer Links */}
          <div className="flex items-center gap-5">
            {footerLinks.map(link => (
              link.download ? (
                <a
                  key={link.path}
                  href={link.path}
                  download
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 mb-6" />

        {/* Bottom row: copyright + Powered by */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground/70 order-2 md:order-1">
            &copy; {currentYear} Anchor. All rights reserved.
          </p>

          {/* Powered by Scriptura ecosystem */}
          <div className="flex flex-col items-center md:items-end gap-3 order-1 md:order-2">
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              Part of the Scriptura Ecosystem
            </span>
            <div className="flex items-center gap-4">
              {ecosystemProducts.map(product => (
                <a
                  key={product.name}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-border transition-all group"
                  title={product.description}
                >
                  <img
                    src={product.logo}
                    alt={product.name}
                    className="h-5 w-5 object-contain rounded-sm"
                  />
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
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

export default AppFooter;
