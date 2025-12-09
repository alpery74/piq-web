import { useState, useEffect } from 'react';
import { X, Moon, Sun, Bell, Eye, Shield, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') !== 'false';
  });
  const [viewTier, setViewTier] = useState(() => {
    return localStorage.getItem('viewTier') || 'simple';
  });

  useEffect(() => {
    localStorage.setItem('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('viewTier', viewTier);
  }, [viewTier]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              <Palette className="w-4 h-4" />
              Appearance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  {isDark ? <Moon className="w-5 h-5 text-ios-blue" /> : <Sun className="w-5 h-5 text-ios-orange" />}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isDark ? 'Dark theme is active' : 'Light theme is active'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    isDark ? 'bg-ios-blue' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      isDark ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* View Preferences */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              <Eye className="w-4 h-4" />
              Default View
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'simple', label: 'Simple', desc: 'Key metrics' },
                { id: 'analyst', label: 'Analyst', desc: 'Deeper insights' },
                { id: 'quant', label: 'Quant', desc: 'Full data' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setViewTier(tier.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    viewTier === tier.id
                      ? 'bg-ios-blue text-white'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="font-semibold text-sm">{tier.label}</p>
                  <p className={`text-xs mt-0.5 ${viewTier === tier.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {tier.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Analysis Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when analysis completes
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-ios-blue' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              <Shield className="w-4 h-4" />
              Privacy & Security
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your data is encrypted and never shared with third parties.
                Portfolio analysis is performed securely on our servers.
              </p>
              <a
                href="/privacy"
                className="inline-block mt-2 text-sm font-medium text-ios-blue hover:underline"
                onClick={onClose}
              >
                View Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            PIQ Labs v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
