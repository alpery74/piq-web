import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, ChevronDown, Bell, Shield, Lock, BarChart3, GraduationCap, ShieldCheck, HelpCircle, CreditCard, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// Get logo based on subscription tier
const getTierLogo = (tier) => {
  switch (tier) {
    case 'basic':
      return '/images/logo_basic.png';
    case 'plus':
      return '/images/logo_plus.png';
    default:
      return '/images/logo.png';
  }
};

// Plan limits for display
const PLAN_LIMITS = {
  free: { name: 'Free', holdings: 5, analyses: 5 },
  basic: { name: 'Basic', holdings: 20, analyses: 10 },
  plus: { name: 'Plus', holdings: 40, analyses: 20 },
};

const Layout = ({ children, onOpenSearch, onOpenSettings, onStartTour, notificationCount = 0 }) => {
  const { user, isAuthenticated, logout, subscription, usage } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isActive = (path) => location.pathname === path;

  // Track scroll for header blur intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* iOS Mesh Gradient Background */}
      <div className="background-aurora"></div>

      {/* iOS Glass Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
          ? 'nav-glass-thick shadow-ios-sm'
          : 'nav-glass'
          }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center tap-scale"
            >
              <div className="relative">
                <img
                  src={getTierLogo(subscription?.tier)}
                  alt="PIQ Labs"
                  className="w-10 h-10 rounded-lg object-contain"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            {/* Desktop Navigation - iOS Segmented Style */}
            <nav className="hidden md:flex items-center">
              <div className="segmented-control">
                <Link
                  to="/"
                  className={`segmented-control-item ${isActive('/') ? 'active' : ''}`}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Dashboard
                </Link>
                <Link
                  to="/legal"
                  className={`segmented-control-item ${isActive('/legal') ? 'active' : ''}`}
                  aria-current={isActive('/legal') ? 'page' : undefined}
                >
                  Legal
                </Link>
                <Link
                  to="/privacy"
                  className={`segmented-control-item ${isActive('/privacy') ? 'active' : ''}`}
                  aria-current={isActive('/privacy') ? 'page' : undefined}
                >
                  Privacy
                </Link>
              </div>
            </nav>

            {/* Header Actions - Search, Settings, Profile */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-white/10"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
                <span className="text-xs text-gray-400">⌘K</span>
              </button>

              {/* Notifications Bell */}
              {isAuthenticated && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-xl transition-all bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-white/10"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-ios-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </p>
                        {notificationCount > 0 && (
                          <span className="text-xs text-ios-blue font-medium cursor-pointer hover:underline">
                            Mark all read
                          </span>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notificationCount === 0 ? (
                          <div className="py-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Alerts appear here when analysis completes
                            </p>
                          </div>
                        ) : (
                          <div className="py-2">
                            <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Analysis Complete</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your portfolio analysis has finished processing</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Just now</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-gray-200/50 dark:border-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center text-white text-sm font-semibold">
                      {getUserInitials()}
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50">
                      {/* Email & Usage Summary */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {usage?.analysesUsed || 0} of {usage?.analysesLimit || 5} analyses • {PLAN_LIMITS[subscription?.tier]?.name || 'Free'}
                        </p>
                      </div>

                      {/* Theme Toggle */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                            <button
                              onClick={() => { if (isDark) toggleTheme(); }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                !isDark
                                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                              }`}
                            >
                              <Sun className="w-3.5 h-3.5" />
                              Light
                            </button>
                            <button
                              onClick={() => { if (!isDark) toggleTheme(); }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                isDark
                                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                              }`}
                            >
                              <Moon className="w-3.5 h-3.5" />
                              Dark
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            onOpenSettings?.();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          Subscription
                        </button>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            onStartTour?.();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                          Guided Tour
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-gray-400" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-ios-blue text-white hover:bg-ios-blue/90"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Icons - Search & Notifications */}
            <div className="md:hidden flex items-center gap-1">
              {/* Search/Command Button */}
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-full text-gray-500 hover:text-ios-blue hover:bg-ios-blue/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-gray-500 hover:text-ios-blue hover:bg-ios-blue/10 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ios-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Mobile Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                      {notificationCount > 0 && (
                        <span className="text-xs text-ios-blue font-medium">Mark all read</span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notificationCount === 0 ? (
                        <div className="py-6 text-center">
                          <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Alerts appear here when analysis completes</p>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Analysis Complete</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your portfolio analysis has finished</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-ios tap-scale transition-colors"
                style={{
                  background: mobileMenuOpen ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                  color: mobileMenuOpen ? 'var(--ios-blue)' : '#8E8E93'
                }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - iOS Sheet Style */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-ios ${mobileMenuOpen ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
          >
            <nav className="py-2 space-y-1">
              {[
                { path: '/', label: 'Dashboard' },
                { path: '/legal', label: 'Legal' },
                { path: '/privacy', label: 'Privacy' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-ios text-base font-medium transition-all duration-200 tap-scale ${isActive(item.path)
                    ? 'text-ios-blue bg-ios-blue/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 container mx-auto px-4 ${isDashboard ? 'pt-2 pb-4 sm:pb-8' : 'py-6 sm:py-8'}`}>
        {children}
      </main>

      {/* iOS Style Footer - Glass */}
      <footer className="mt-auto">
        {/* Social Proof Stats Bar */}
        <div className="border-t border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/80 via-white/80 to-gray-50/80 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-ios-blue" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">1K+ Analyses Run</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-ios-green" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Bank-Level Security</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Data Never Sold</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-ios-orange" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Built by PhDs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-3 sm:py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left: Copyright & Links */}
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2025 PIQ Labs
                </p>
                <span className="hidden md:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <Link
                  to="/legal"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors hover:text-ios-blue"
                >
                  Privacy & Terms
                </Link>
              </div>

              {/* Center: Trust Badges */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100/80 dark:bg-gray-800/80">
                  <Shield className="w-3.5 h-3.5 text-ios-green" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">256-bit SSL</span>
                </div>
              </div>

              {/* Right: Disclaimer */}
              <p className="text-xs text-center md:text-right max-w-md text-gray-400 dark:text-gray-500">
                PIQ Labs provides financial data and analysis for informational purposes only.
                Not investment advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
