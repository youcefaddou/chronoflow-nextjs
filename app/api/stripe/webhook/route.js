import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe.js';
import { updateUserSubscription, cancelUserSubscription } from '../../../../lib/subscription.js';
import { connectMongo } from '../../../../lib/mongodb.js';
import User from '../../../../models/user.js';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET non configuré');
      return NextResponse.json(
        { error: 'Webhook secret non configuré' },
        { status: 500 }
      );
    }

    let event;

    // Vérifier la signature du webhook
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erreur de vérification du webhook:', err.message);
      return NextResponse.json(
        { error: 'Signature webhook invalide' },
        { status: 400 }
      );
    }

    console.log('Webhook reçu:', event.type);

    // Traiter les différents types d'événements
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Événement non traité: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Gestion de la création d'abonnement
async function handleSubscriptionCreated(subscription) {
  try {
    console.log('Nouvel abonnement créé:', subscription.id);
    
    await connectMongo();
    
    // Trouver l'utilisateur par customer ID
    const user = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer });
    
    if (user) {
      const subscriptionData = {
        plan: 'pro',
        status: subscription.status,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      };

      await updateUserSubscription(user._id, subscriptionData);
      console.log('Abonnement créé pour l\'utilisateur:', user._id);
    }
  } catch (error) {
    console.error('Erreur lors de la création d\'abonnement:', error);
  }
}

// Gestion de la mise à jour d'abonnement
async function handleSubscriptionUpdated(subscription) {
  try {
    console.log('Abonnement mis à jour:', subscription.id);
    
    await connectMongo();
    
    const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscription.id });
    
    if (user) {
      const subscriptionData = {
        plan: subscription.status === 'active' ? 'pro' : 'free',
        status: subscription.status,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      };

      await updateUserSubscription(user._id, subscriptionData);
      console.log('Abonnement mis à jour pour l\'utilisateur:', user._id);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'abonnement:', error);
  }
}

// Gestion de l'annulation d'abonnement
async function handleSubscriptionDeleted(subscription) {
  try {
    console.log('Abonnement annulé:', subscription.id);
    
    await connectMongo();
    
    const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscription.id });
    
    if (user) {
      await cancelUserSubscription(user._id);
      console.log('Abonnement annulé pour l\'utilisateur:', user._id);
    }
  } catch (error) {
    console.error('Erreur lors de l\'annulation d\'abonnement:', error);
  }
}

// Gestion du paiement réussi
async function handlePaymentSucceeded(invoice) {
  try {
    console.log('Paiement réussi pour la facture:', invoice.id);
    
    if (invoice.subscription) {
      // Récupérer les détails de l'abonnement
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      await handleSubscriptionUpdated(subscription);
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement réussi:', error);
  }
}

// Gestion de l'échec de paiement
async function handlePaymentFailed(invoice) {
  try {
    console.log('Échec de paiement pour la facture:', invoice.id);
    
    await connectMongo();
    
    if (invoice.subscription) {
      const user = await User.findOne({ 'subscription.stripeSubscriptionId': invoice.subscription });
      
      if (user) {
        // Marquer l'abonnement comme ayant des problèmes de paiement
        const subscriptionData = {
          plan: 'free', // Retour au plan gratuit en cas d'échec
          status: 'payment_failed',
          stripeCustomerId: user.subscription.stripeCustomerId,
          stripeSubscriptionId: user.subscription.stripeSubscriptionId,
          currentPeriodStart: user.subscription.currentPeriodStart,
          currentPeriodEnd: user.subscription.currentPeriodEnd
        };

        await updateUserSubscription(user._id, subscriptionData);
        console.log('Statut d\'échec de paiement appliqué à l\'utilisateur:', user._id);
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'échec de paiement:', error);
  }
}
