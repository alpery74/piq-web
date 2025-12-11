import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Layers, Target, Menu, X, Settings, Moon, Sun, HelpCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Navigation items - IDs must match Dashboard.jsx section IDs
const NAV_ITEMS = [
  {
    id: 'overview-section',
    label: 'Overview',
    icon: Activity,
    // Use explicit classes to avoid Tailwind JIT purging
    activeClass: 'text-ios-green',
    dotClass: 'bg-ios-green',
  },
  {
    id: 'risk-section',
    label: 'Risk',
    icon: TrendingUp,
    activeClass: 'text-ios-blue',
    dotClass: 'bg-ios-blue',
  },
  {
    id: 'holdings-section',
    label: 'Holdings',
    icon: Layers,
    activeClass: 'text-ios-purple',
    dotClass: 'bg-ios-purple',
  },
  {
    id: 'optimization-section',
    label: 'Optimize',
    icon: Target,
    activeClass: 'text-ios-orange',
    dotClass: 'bg-ios-orange',
  },
];

// More menu items
const MORE_ITEMS = [
  {
    id: 'theme',
    label: 'Dark Mode',
    icon: Moon,
    darkIcon: Sun,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
  },
];

const MobileBottomNav = ({ onStartTour }) => {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.innerHeight * 0.4;
      let closestSection = activeSection;
      let closestDistance = Infinity;

      NAV_ITEMS.forEach((item) => {
        const element = document.getElementById(item.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - offset);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = item.id;
        }
      });

      if (closestSection !== activeSection) {
        setActiveSection(closestSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
    setIsMoreOpen(false);
  };

  const handleMoreAction = (id) => {
    switch (id) {
      case 'theme':
        toggleTheme();
        break;
      case 'help':
        onStartTour?.();
        break;
      case 'settings':
        // Open settings
        break;
    }
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* More menu overlay */}
      {isMoreOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* More menu panel */}
      <div
        className={`md:hidden fixed bottom-[68px] left-0 right-0 z-40 transition-transform duration-300 ${
          isMoreOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-4 mb-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {MORE_ITEMS.map((item) => {
            const Icon = item.id === 'theme' && isDark ? item.darkIcon || item.icon : item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMoreAction(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.id === 'theme' ? (isDark ? 'Light Mode' : 'Dark Mode') : item.label}
                </span>
                {item.id === 'theme' && (
                  <div
                    className={`ml-auto w-10 h-6 rounded-full p-0.5 transition-colors ${
                      isDark ? 'bg-ios-blue' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        isDark ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? item.activeClass
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
                {isActive && (
                  <div
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${item.dotClass}`}
                  />
                )}
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isMoreOpen ? 'text-ios-blue' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {isMoreOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
            <span className="text-[10px] font-medium mt-1">More</span>
          </button>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default MobileBottomNav;
