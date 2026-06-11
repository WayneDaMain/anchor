import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/daily-reading-dashboard', icon: 'LayoutDashboard' },
    { label: 'Progress', path: '/progress-reports', icon: 'TrendingUp' },
    { label: 'Groups', path: '/group-management', icon: 'Users' },
    { label: 'Plans', path: '/plan-creation-wizard', icon: 'BookOpen' },
    { label: 'Read Bible', path: 'https://web.biblescriptura.com', icon: 'BookOpen', isExternal: true },
    { label: 'Research', path: 'https://folio.biblescriptura.com', icon: 'Search', isExternal: true },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch {}
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = () => {
    const name = currentUser?.displayName || currentUser?.email || 'U';
    return name.charAt(0).toUpperCase() + '.';
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-navigation max-w-7xl mx-auto bg-card/90 backdrop-blur-md border border-border/80 rounded-full shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <Link to="/daily-reading-dashboard" className="flex items-center space-x-2.5">
                <img src="/anchor.png" alt="Anchor" className="h-8 w-8 object-contain" />
                <span className="text-lg font-heading font-extrabold text-foreground tracking-tight">Anchor</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems?.map((item) => 
                item.isExternal ? (
                  <a
                    key={item?.path}
                    href={item?.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-250 text-muted-foreground hover:text-foreground hover:bg-muted/40 flex items-center gap-1"
                  >
                    <span>{item?.label}</span>
                    <Icon name="ExternalLink" size={12} className="opacity-60" />
                  </a>
                ) : (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-250 ${
                      isActivePath(item?.path)
                        ? 'bg-[#1c142c] text-white dark:bg-[#7c3aed] dark:text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    {item?.label}
                  </Link>
                )
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-muted/40 transition-gentle"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center bg-muted text-foreground text-xs font-bold font-heading shadow-sm overflow-hidden">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials()}</span>
                    )}
                  </div>
                  <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-dropdown"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-popover rounded-2xl border border-border/80 shadow-xl z-dropdown py-2">
                      <div className="py-1">
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-muted transition-gentle text-sm font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Icon name="Settings" size={16} />
                          <span>Settings</span>
                        </Link>
                        <button
                          className="flex items-center space-x-3 px-4 py-2.5 w-full text-left hover:bg-muted transition-gentle text-sm font-medium"
                          onClick={() => {
                            setUserMenuOpen(false);
                            toggleTheme();
                          }}
                        >
                          <Icon name="Moon" size={16} />
                          <span>Toggle Theme</span>
                        </button>
                        <div className="border-t border-border my-2" />
                        <button
                          className="flex items-center space-x-3 px-4 py-2.5 w-full text-left text-destructive hover:bg-muted transition-gentle text-sm font-medium"
                          onClick={handleLogout}
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden p-2 rounded-full hover:bg-muted/40 transition-gentle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-dropdown md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-20 left-4 right-4 bg-card border border-border/80 z-dropdown rounded-2xl shadow-xl overflow-hidden p-4 md:hidden">
              <nav className="space-y-1">
                {navigationItems?.map((item) => 
                  item.isExternal ? (
                    <a
                      key={item?.path}
                      href={item?.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleNavClick}
                      className="flex items-center justify-between px-4 py-3 rounded-xl transition-gentle text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      <span>{item?.label}</span>
                      <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
                    </a>
                  ) : (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={handleNavClick}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-gentle text-sm font-semibold ${
                        isActivePath(item?.path)
                          ? 'bg-[#1c142c] text-white dark:bg-[#7c3aed]'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{item?.label}</span>
                    </Link>
                  )
                )}
                <div className="border-t border-border my-3" />
                <Link
                  to="/settings"
                  onClick={handleNavClick}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted transition-gentle text-sm font-semibold text-foreground"
                >
                  <span>Settings</span>
                </Link>
                <button
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl hover:bg-muted transition-gentle text-sm font-semibold text-foreground"
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>Toggle Theme</span>
                </button>
                <button
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-destructive hover:bg-muted transition-gentle text-sm font-semibold"
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </>
        )}
      </header>
      <div className="h-24" />
    </>
  );
};

export default Header;