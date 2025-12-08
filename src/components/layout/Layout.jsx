import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* iOS Mesh Gradient Background */}
      <div className="background-aurora"></div>

      {/* iOS Glass Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'nav-glass-thick shadow-ios-sm'
            : 'nav-glass'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 tap-scale"
            >
              <div className="relative">
                <img
                  src="/images/logo.svg"
                  alt="PIQ Labs"
                  className="w-9 h-9 rounded-ios object-contain"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-ios bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg font-semibold tracking-tight hidden sm:block" style={{ color: '#1C1C1E' }}>
                PIQ Labs
              </span>
            </Link>

            {/* Desktop Navigation - iOS Segmented Style */}
            <nav className="hidden md:flex items-center">
              <div className="segmented-control">
                <Link
                  to="/"
                  className={`segmented-control-item ${isActive('/') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/legal"
                  className={`segmented-control-item ${isActive('/legal') ? 'active' : ''}`}
                >
                  Legal
                </Link>
                <Link
                  to="/privacy"
                  className={`segmented-control-item ${isActive('/privacy') ? 'active' : ''}`}
                >
                  Privacy
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button - iOS Style */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-ios tap-scale transition-colors"
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

          {/* Mobile Navigation - iOS Sheet Style */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-ios ${
              mobileMenuOpen ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0'
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
                  className={`block py-3 px-4 rounded-ios text-base font-medium transition-all duration-200 tap-scale ${
                    isActive(item.path)
                      ? 'text-ios-blue bg-ios-blue/8'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
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
      <main className={`flex-1 container mx-auto px-4 ${isDashboard ? 'pt-2 pb-8' : 'py-8'}`}>
        {children}
      </main>

      {/* iOS Style Footer - Glass */}
      <footer className="mt-auto">
        <div
          className="border-t"
          style={{
            background: 'var(--glass-bg-thick)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderColor: 'rgba(60, 60, 67, 0.12)'
          }}
        >
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
                  © 2025 PIQ Labs
                </p>
                <span className="hidden md:block w-1 h-1 rounded-full" style={{ background: 'rgba(60, 60, 67, 0.3)' }} />
                <Link
                  to="/legal"
                  className="text-sm font-medium transition-colors hover:text-ios-blue"
                  style={{ color: 'rgba(60, 60, 67, 0.6)' }}
                >
                  Privacy & Terms
                </Link>
              </div>
              <p
                className="text-xs text-center md:text-right max-w-md"
                style={{ color: 'rgba(60, 60, 67, 0.4)' }}
              >
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
