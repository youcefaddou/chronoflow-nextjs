import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe.js';
import { updateUserSubscription } from '../../../../lib/subscription.js';
import { verifyAuth } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID manquant' },
        { status: 400 }
      );
    }

    // Récupérer les détails de la session de paiement
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });    if (checkoutSession.payment_status === 'paid') {
      // Récupérer l'utilisateur connecté s'il existe
      const authResult = await verifyAuth();
      
      if (authResult.isAuthenticated && authResult.user) {
        // Mettre à jour le statut d'abonnement de l'utilisateur
        const subscriptionData = {
          plan: 'pro',
          status: 'active',
          stripeCustomerId: checkoutSession.customer.id,
          stripeSubscriptionId: checkoutSession.subscription?.id,
          currentPeriodStart: checkoutSession.subscription?.current_period_start 
            ? new Date(checkoutSession.subscription.current_period_start * 1000) 
            : new Date(),
          currentPeriodEnd: checkoutSession.subscription?.current_period_end 
            ? new Date(checkoutSession.subscription.current_period_end * 1000) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
        };

        await updateUserSubscription(authResult.user.userId, subscriptionData);
      }
      
      return NextResponse.json({
        success: true,
        session: {
          id: checkoutSession.id,
          payment_status: checkoutSession.payment_status,
          customer_details: checkoutSession.customer_details,
          amount_total: checkoutSession.amount_total,
          currency: checkoutSession.currency
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Paiement non confirmé',
      payment_status: checkoutSession.payment_status,
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}

// Méthode GET pour la compatibilité (si nécessaire)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID manquant' },
        { status: 400 }
      );
    }

    // Récupérer les détails de la session de paiement
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status === 'paid') {
      return NextResponse.json({
        status: 'success',
        customerEmail: checkoutSession.customer_details?.email,
        paymentStatus: checkoutSession.payment_status,
      });
    }

    return NextResponse.json({
      status: 'pending',
      paymentStatus: checkoutSession.payment_status,
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}
