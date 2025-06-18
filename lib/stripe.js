import Stripe from 'stripe';

// Configuration du serveur Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

// Configuration du client Stripe (pour le frontend)
export const getStripePublishableKey = () => {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('Stripe publishable key is not configured');
  }
  return key;
};

// Helper pour formater les prix en centimes
export function formatAmountForStripe(amount, currency = 'eur') {
  const numberFormat = new Intl.NumberFormat(['fr-FR'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

// Helper pour formater les prix depuis Stripe
export function formatAmountFromStripe(amount, currency = 'eur') {
  const numberFormat = new Intl.NumberFormat(['fr-FR'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? amount : amount / 100;
}
