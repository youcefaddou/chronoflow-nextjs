import { NextResponse } from 'next/server';
import { getUserSubscriptionStatus } from '../../../../lib/subscription.js';
import { verifyAuth } from '../../../../lib/auth.js';

export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth();
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }    // Récupérer le statut d'abonnement
    const subscriptionStatus = await getUserSubscriptionStatus(authResult.user.userId);
    
    return NextResponse.json({
      success: true,
      subscription: subscriptionStatus
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du statut d\'abonnement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
