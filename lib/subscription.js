import { connectMongo } from './mongodb'
import User from '../models/user'

// Met à jour le statut d'abonnement d'un utilisateur
export async function updateUserSubscription(userId, subscriptionData) {
  try {
    await connectMongo()
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscription: {
          plan: subscriptionData.plan || 'pro',
          status: subscriptionData.status || 'active',
          stripeCustomerId: subscriptionData.stripeCustomerId,
          stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
          currentPeriodStart: subscriptionData.currentPeriodStart,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          updatedAt: new Date()
        }
      },
      { new: true }
    )
    
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error)
    return { success: false, error: error.message }
  }
}

// Vérifie le statut d'abonnement d'un utilisateur
export async function getUserSubscriptionStatus(userId) {
  try {
    await connectMongo()
    
    const user = await User.findById(userId).select('subscription')
    
    if (!user || !user.subscription) {
      return { plan: 'free', status: 'inactive' }
    }

    return user.subscription
  } catch (error) {
    console.error('Erreur lors de la récupération du statut d\'abonnement:', error)
    return { plan: 'free', status: 'inactive' }
  }
}

// Annule l'abonnement d'un utilisateur
export async function cancelUserSubscription(userId) {
  try {
    await connectMongo()
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        'subscription.status': 'canceled',
        'subscription.updatedAt': new Date()
      },
      { new: true }
    )

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error)
    return { success: false, error: error.message }
  }
}
