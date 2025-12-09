import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key (safe to expose - this is the public key)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51ScT1nFD3f8NvjWpppXvvB4d1xnzrWM8IvQA9UNdFKIKbaUefpwxYcf5R3YdQr4gE2DxKIwvVPQYmyhQEn4oBFPE00620huDsM';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Use the same API base URL as the rest of the app
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://piq-2025-8fc430488343.herokuapp.com/api').replace(/\/api$/, '');

/**
 * Create a Stripe Checkout session and redirect to checkout
 * @param {string} planKey - 'basic' or 'plus'
 * @param {string} billingPeriod - 'monthly' or 'yearly'
 * @param {string} authToken - User's auth token
 */
export async function createCheckoutSession(planKey, billingPeriod, authToken) {
  try {
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

    // Redirect to Stripe Checkout URL
    window.location.href = url;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

/**
 * Open Stripe Customer Portal for managing subscriptions
 * @param {string} authToken - User's auth token
 */
export async function openCustomerPortal(authToken) {
  try {
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

    // Redirect to customer portal
    window.location.href = url;
  } catch (error) {
    console.error('Customer portal error:', error);
    throw error;
  }
}

/**
 * Get the user's current subscription status
 * @param {string} authToken - User's auth token
 */
export async function getSubscriptionStatus(authToken) {
  try {
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
  } catch (error) {
    console.error('Subscription fetch error:', error);
    throw error;
  }
}

export { stripePromise };
