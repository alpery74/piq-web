import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Use the same API base URL as the rest of the app (strip /api suffix for endpoints)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api').replace(/\/api$/, '');

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

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
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
