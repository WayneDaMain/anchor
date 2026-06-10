import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const MobileBottomNav = () => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/daily-reading-dashboard', icon: 'LayoutDashboard' },
    { label: 'Progress', path: '/progress-reports', icon: 'TrendingUp' },
    { label: 'Groups', path: '/group-management', icon: 'Users' },
    { label: 'Plans', path: '/plan-creation-wizard', icon: 'BookOpen' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-mobile-nav safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navigationItems?.map((item) => (
          <Link
            key={item?.path}
            to={item?.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-gentle ${
              isActivePath(item?.path)
                ? 'text-accent' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={item?.icon} size={24} />
            <span className="caption text-xs mt-1">{item?.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;