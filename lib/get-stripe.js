import { loadStripe } from '@stripe/stripe-js';

// Configuration du client Stripe pour le frontend
let stripePromise;

export function getStripe() {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      throw new Error('Stripe publishable key is not configured');
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
}
