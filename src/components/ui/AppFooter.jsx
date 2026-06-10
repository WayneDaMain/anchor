import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Dashboard', path: '/daily-reading-dashboard' },
    { label: 'Progress', path: '/progress-reports' },
    { label: 'Groups', path: '/group-management' },
    { label: 'Settings', path: '/settings' },
  ];

  const legalLinks = [
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

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal Links */}
          <div className="flex items-center gap-5">
            {legalLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
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
