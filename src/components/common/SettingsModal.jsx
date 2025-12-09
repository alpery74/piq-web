import { useState, useEffect } from 'react';
import { X, Moon, Sun, Bell, Eye, Palette, CreditCard, User, Wand2, CheckCircle2, LogOut, Trash2, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { createCheckoutSession, openCustomerPortal, getSubscriptionStatus } from '@/services/stripe';

// Plan data matching iOS app
const PLANS = {
  free: {
    name: 'Free Plan',
    description: 'Free plan includes up to 5 holdings per analysis, 5 analyses each month, and our agentic AI portfolio lab with factor diagnostics, diversification math, Monte Carlo stress tests, optimization playbooks, implementation guidance, and tax-efficiency considerations.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxHoldings: 5,
    maxAnalyses: 5,
  },
  basic: {
    name: 'Basic Plan',
    tagline: 'Lift your portfolio ceilings while keeping the agentic AI toolkit.',
    features: [
      'Up to 20 holdings per analysis (vs 5 on Free)',
      '10 analyses each month (vs 5 on Free)',
      'Agentic AI toolkit included',
    ],
    monthlyPrice: 2.99,
    yearlyPrice: 29.99,
    maxHoldings: 20,
    maxAnalyses: 10,
  },
  plus: {
    name: 'Plus Plan',
    tagline: 'Max capacity for complex portfolios with the same agentic AI guidance.',
    features: [
      'Up to 40 holdings per analysis (vs 5 on Free)',
      '20 analyses each month (vs 5 on Free)',
      'Agentic AI toolkit included',
    ],
    monthlyPrice: 5.99,
    yearlyPrice: 59.99,
    maxHoldings: 40,
    maxAnalyses: 20,
  },
};

const TABS = [
  { id: 'plans', label: 'Plans', icon: CreditCard },
  { id: 'interface', label: 'Interface', icon: Wand2 },
  { id: 'account', label: 'Account', icon: User },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('plans');
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') !== 'false';
  });
  const [viewTier, setViewTier] = useState(() => {
    return localStorage.getItem('viewTier') || 'simple';
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    tier: 'free',
    status: 'active',
    expiresAt: null,
  });
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null); // 'basic-monthly', 'plus-yearly', etc.
  const [error, setError] = useState(null);

  // Fetch subscription status when modal opens
  useEffect(() => {
    if (isOpen && token) {
      fetchSubscription();
    }
  }, [isOpen, token]);

  const fetchSubscription = async () => {
    setLoadingSubscription(true);
    setError(null);
    try {
      const data = await getSubscriptionStatus(token);
      setSubscription({
        tier: data.tier || 'free',
        status: data.status || 'active',
        expiresAt: data.expiresAt,
      });
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      // Keep default free tier on error
    } finally {
      setLoadingSubscription(false);
    }
  };

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

  const handleUpgrade = async (plan, billingPeriod) => {
    const loadingKey = `${plan}-${billingPeriod}`;
    setCheckoutLoading(loadingKey);
    setError(null);

    try {
      await createCheckoutSession(plan, billingPeriod, token);
      // User will be redirected to Stripe Checkout
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setError(null);
    try {
      await openCustomerPortal(token);
      // User will be redirected to Stripe Customer Portal
    } catch (err) {
      setError(err.message || 'Failed to open subscription management.');
    }
  };

  const handleRestorePurchases = () => {
    // For web, this opens the customer portal to view subscription history
    handleManageSubscription();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion coming soon!');
    }
  };

  if (!isOpen) return null;

  const currentPlan = PLANS[subscription.tier] || PLANS.free;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings & Account</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-ios-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                Account & Subscription
              </h3>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loadingSubscription ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-ios-blue" />
                </div>
              ) : (
                <>
                  {/* Current Plan */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ios-blue/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-ios-blue" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">Current Plan</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">{currentPlan.name}</div>
                        {subscription.status === 'expired' && (
                          <div className="text-sm font-medium text-amber-500">Expired</div>
                        )}
                        {subscription.status === 'active' && (
                          <div className="text-sm font-medium text-green-500">Active</div>
                        )}
                        {subscription.status === 'cancelled' && (
                          <div className="text-sm font-medium text-red-500">Cancelled</div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentPlan.description || `Includes up to ${currentPlan.maxHoldings} holdings per analysis and ${currentPlan.maxAnalyses} analyses per month.`}
                      </p>
                    </div>
                    {/* Manage Subscription button for paid users */}
                    {subscription.tier !== 'free' && (
                      <button
                        onClick={handleManageSubscription}
                        className="mt-3 w-full py-2 px-4 text-sm font-medium text-ios-blue bg-ios-blue/10 hover:bg-ios-blue/20 rounded-lg transition-colors"
                      >
                        Manage Subscription
                      </button>
                    )}
                  </div>

                  {/* Upgrade Options */}
                  {subscription.tier !== 'basic' && (
                    <PlanCard
                      plan={PLANS.basic}
                      planKey="basic"
                      onUpgrade={handleUpgrade}
                      isCurrentPlan={subscription.tier === 'basic'}
                      checkoutLoading={checkoutLoading}
                    />
                  )}

                  {subscription.tier !== 'plus' && (
                    <PlanCard
                      plan={PLANS.plus}
                      planKey="plus"
                      onUpgrade={handleUpgrade}
                      isCurrentPlan={subscription.tier === 'plus'}
                      checkoutLoading={checkoutLoading}
                    />
                  )}
                </>
              )}

              {/* Footer Links */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 text-center">
                <button
                  onClick={handleRestorePurchases}
                  className="text-sm font-medium text-ios-blue hover:underline"
                >
                  Restore Purchases
                </button>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Link to="/legal" onClick={onClose} className="hover:text-ios-blue hover:underline">
                    Terms of Service
                  </Link>
                  <span>•</span>
                  <Link to="/privacy" onClick={onClose} className="hover:text-ios-blue hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Interface Tab */}
          {activeTab === 'interface' && (
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
                    <ToggleSwitch checked={isDark} onChange={toggleTheme} />
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
                  <ToggleSwitch checked={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="p-6 space-y-6">
              {/* Account Info */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  <User className="w-4 h-4" />
                  Account Information
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.email || 'Not signed in'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Sign Out</span>
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-600 dark:text-red-400">Delete Account</span>
                  </button>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Privacy & Security
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your data is encrypted and never shared with third parties.
                    Portfolio analysis is performed securely on our servers.
                  </p>
                  <Link
                    to="/privacy"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-ios-blue hover:underline"
                  >
                    View Privacy Policy
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            PIQ Labs v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-7 rounded-full transition-colors ${
      checked ? 'bg-ios-blue' : 'bg-gray-300 dark:bg-gray-600'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// Plan Card Component
const PlanCard = ({ plan, planKey, onUpgrade, isCurrentPlan, checkoutLoading }) => {
  const yearlyMonthlyEquivalent = (plan.yearlyPrice / 12).toFixed(2);
  const isMonthlyLoading = checkoutLoading === `${planKey}-monthly`;
  const isYearlyLoading = checkoutLoading === `${planKey}-yearly`;
  const isAnyLoading = checkoutLoading !== null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h4>
        {!isCurrentPlan && (
          <span className="px-3 py-1 text-xs font-semibold text-ios-blue bg-ios-blue/10 rounded-full border border-ios-blue/30">
            UPGRADE OPTION
          </span>
        )}
      </div>

      {/* Tagline */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {plan.tagline}
      </p>

      {/* Features */}
      <div className="space-y-2 mb-4">
        {plan.features?.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-ios-blue flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* Pricing Buttons */}
      {!isCurrentPlan && (
        <div className="space-y-2">
          <button
            onClick={() => onUpgrade(planKey, 'monthly')}
            disabled={isAnyLoading}
            className="w-full py-3 px-4 bg-ios-blue hover:bg-ios-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isMonthlyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            ${plan.monthlyPrice.toFixed(2)} / Month
          </button>
          <button
            onClick={() => onUpgrade(planKey, 'yearly')}
            disabled={isAnyLoading}
            className="w-full py-3 px-4 bg-ios-blue hover:bg-ios-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isYearlyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            ${plan.yearlyPrice.toFixed(2)} / Year
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            ≈ ${yearlyMonthlyEquivalent}/mo (billed annually)
          </p>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Auto-renews; cancel anytime in Settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;
