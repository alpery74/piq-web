import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key (safe to expose - this is the public key)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51ScT1nFD3f8NvjWpppXvvB4d1xnzrWM8IvQA9UNdFKIKbaUefpwxYcf5R3YdQr4gE2DxKIwvVPQYmyhQEn4oBFPE00620huDsM';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Use the same API base URL as the rest of the app
const API_BASE = 'https://piq-2025-8fc430488343.herokuapp.com';

// Validate redirect URL is from a trusted domain
const validateRedirectUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const trustedDomains = ['stripe.com', 'checkout.stripe.com', 'billing.stripe.com'];
    const isTrusted = trustedDomains.some(domain => urlObj.hostname.endsWith(domain));
    if (!isTrusted) {
      throw new Error('Invalid redirect URL: untrusted domain');
    }
    return url;
  } catch (e) {
    throw new Error('Invalid redirect URL');
  }
};

/**
 * Create a Stripe Checkout session and redirect to checkout
 * @param {string} planKey - 'basic' or 'plus'
 * @param {string} billingPeriod - 'monthly' or 'yearly'
 * @param {string} authToken - User's auth token
 */
export async function createCheckoutSession(planKey, billingPeriod, authToken) {
  if (!planKey || !billingPeriod || !authToken) {
    throw new Error('Missing required parameters for checkout session');
  }

  const response = await fetch(`${API_BASE}/api/stripe/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      plan: planKey,
      billingPeriod: billingPeriod,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const { url } = await response.json();

  // Validate and redirect to Stripe Checkout URL
  window.location.href = validateRedirectUrl(url);
}

/**
 * Open Stripe Customer Portal for managing subscriptions
 * @param {string} authToken - User's auth token
 */
export async function openCustomerPortal(authToken) {
  if (!authToken) {
    throw new Error('Auth token is required');
  }

  const response = await fetch(`${API_BASE}/api/stripe/portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to open customer portal');
  }

  const { url } = await response.json();

  // Validate and redirect to customer portal
  window.location.href = validateRedirectUrl(url);
}

/**
 * Get the user's current subscription status
 * @param {string} authToken - User's auth token
 */
export async function getSubscriptionStatus(authToken) {
  const response = await fetch(`${API_BASE}/api/stripe/subscription`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch subscription');
  }

  return await response.json();
}

/**
 * Get the user's usage limits and stats
 * @param {string} authToken - User's auth token
 */
export async function getUserLimits(authToken) {
  const response = await fetch(`${API_BASE}/api/user-limits`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user limits');
  }

  const data = await response.json();
  return data.data; // Returns the nested data object with usage_stats and tier_limits
}

export { stripePromise };
