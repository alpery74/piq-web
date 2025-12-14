import { useState, useEffect } from 'react';
import { X, CreditCard, User, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { createCheckoutSession, openCustomerPortal, getSubscriptionStatus } from '@/services/stripe';
import { deleteAccount } from '@/services/authService';

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

const SettingsModal = ({ isOpen, onClose }) => {
  const { token, logout } = useAuth();

  // Subscription state
  const [subscription, setSubscription] = useState({
    tier: 'free',
    status: 'active',
    expiresAt: null,
  });
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [error, setError] = useState(null);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch subscription status when modal opens
  useEffect(() => {
    if (isOpen && token) {
      fetchSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
      // Failed to fetch subscription - keep loading state
    } finally {
      setLoadingSubscription(false);
    }
  };

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
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setError(null);
    try {
      await openCustomerPortal(token);
    } catch (err) {
      setError(err.message || 'Failed to open subscription management.');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteAccount(token);
      logout();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
      setDeleteLoading(false);
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
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                    {subscription.status === 'active' && (
                      <div className="text-sm font-medium text-green-500">Active</div>
                    )}
                    {subscription.status === 'expired' && (
                      <div className="text-sm font-medium text-amber-500">Expired</div>
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
                    className="mt-3 w-full py-2.5 px-4 text-sm font-medium text-ios-blue border border-ios-blue/40 hover:border-ios-blue hover:bg-ios-blue/5 rounded-xl transition-all"
                  >
                    Manage Subscription
                  </button>
                )}
              </div>

              {/* Upgrade Options - only show plans that are actual upgrades */}
              {/* Free users can upgrade to Basic or Plus */}
              {subscription.tier === 'free' && (
                <>
                  <PlanCard
                    plan={PLANS.basic}
                    planKey="basic"
                    onUpgrade={handleUpgrade}
                    checkoutLoading={checkoutLoading}
                  />
                  <PlanCard
                    plan={PLANS.plus}
                    planKey="plus"
                    onUpgrade={handleUpgrade}
                    checkoutLoading={checkoutLoading}
                  />
                </>
              )}

              {/* Basic users can only upgrade to Plus */}
              {subscription.tier === 'basic' && (
                <PlanCard
                  plan={PLANS.plus}
                  planKey="plus"
                  onUpgrade={handleUpgrade}
                  checkoutLoading={checkoutLoading}
                />
              )}

              {/* Plus users are at the top tier - no upgrades available */}
            </>
          )}

          {/* Footer Links */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 text-center">
            <button
              onClick={handleManageSubscription}
              className="text-sm font-medium text-ios-blue hover:underline"
            >
              Restore Purchases
            </button>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/legal" onClick={onClose} className="hover:text-ios-blue hover:underline">
                Terms of Service
              </Link>
              <span>-</span>
              <Link to="/privacy" onClick={onClose} className="hover:text-ios-blue hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Danger Zone - Delete Account */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 w-full text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 mb-3 text-center">
                  Are you sure? This will permanently delete your account and all associated data.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 py-2 px-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Plan Card Component - only shown for actual upgrades
const PlanCard = ({ plan, planKey, onUpgrade, checkoutLoading }) => {
  const yearlyMonthlyEquivalent = (plan.yearlyPrice / 12).toFixed(2);
  const isMonthlyLoading = checkoutLoading === `${planKey}-monthly`;
  const isYearlyLoading = checkoutLoading === `${planKey}-yearly`;
  const isAnyLoading = checkoutLoading !== null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h4>
        <span className="px-3 py-1 text-xs font-semibold text-ios-blue bg-ios-blue/10 rounded-full border border-ios-blue/30">
          UPGRADE
        </span>
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
      <div className="space-y-2">
        <button
          onClick={() => onUpgrade(planKey, 'monthly')}
          disabled={isAnyLoading}
          className="w-full py-2.5 px-4 bg-ios-blue hover:bg-ios-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isMonthlyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          ${plan.monthlyPrice.toFixed(2)} / Month
        </button>
        <button
          onClick={() => onUpgrade(planKey, 'yearly')}
          disabled={isAnyLoading}
          className="w-full py-2.5 px-4 bg-ios-blue hover:bg-ios-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isYearlyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          ${plan.yearlyPrice.toFixed(2)} / Year
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          ${yearlyMonthlyEquivalent}/mo billed annually
        </p>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Auto-renews. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default SettingsModal;
