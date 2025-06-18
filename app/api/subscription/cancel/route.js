import { NextResponse } from 'next/server'
import { verifyAuth } from '../../../../lib/auth'
import { stripe } from '../../../../lib/stripe'
import { connectMongo } from '../../../../lib/mongoose'
import User from '../../../../models/user'

export async function POST() {
  try {
    const authResult = await verifyAuth()
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }    await connectMongo()
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email: authResult.user.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Vérifier qu'il a un abonnement
    if (!user.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Annuler l'abonnement dans Stripe (à la fin de la période de facturation)
    const subscription = await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
      metadata: {
        canceled_by: authResult.user.email,
        canceled_at: new Date().toISOString()
      }
    })

    // Mettre à jour l'utilisateur dans la base de données
    await User.findOneAndUpdate(
      { email: authResult.user.email },
      {
        subscriptionStatus: 'canceled',
        subscriptionCanceledAt: new Date(),
        subscriptionEndDate: new Date(subscription.current_period_end * 1000)
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully',
      endDate: new Date(subscription.current_period_end * 1000).toISOString(),
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: subscription.current_period_end
      }
    })

  } catch (error) {
    console.error('Error canceling subscription:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to cancel subscription',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
