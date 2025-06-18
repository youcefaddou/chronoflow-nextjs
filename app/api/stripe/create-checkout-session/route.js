import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe.js';

export async function POST(request) {
  try {
    // Pour l'instant, on va tester sans authentification stricte
    // Tu pourras ajouter ta logique d'authentification plus tard
    
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID manquant' },
        { status: 400 }
      );
    }

    // Créer la session de paiement Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
      // customer_email: 'test@example.com', // Tu pourras récupérer l'email de l'utilisateur connecté
      metadata: {
        // userId: 'user_id_here', // Tu pourras ajouter l'ID utilisateur
      },
      subscription_data: {
        metadata: {
          // userId: 'user_id_here',
        },
      },
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url 
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
