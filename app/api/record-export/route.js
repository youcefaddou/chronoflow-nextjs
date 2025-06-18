/**
 * API route pour enregistrer les exports côté serveur
 * /api/record-export
 */

import { NextResponse } from 'next/server'
import { recordExport } from '../../../lib/plan-limits-server'
// import { getUser } from '../../../lib/auth' // Votre fonction d'authentification

export async function POST(request) {
  try {
    // 1. Récupérer l'utilisateur authentifié
    // const user = await getUser(request)
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' }, 
    //     { status: 401 }
    //   )
    // }

    // Pour l'exemple, simulons un utilisateur
    const user = { 
      id: 'user123', 
      _id: 'user123'
    }

    // 2. Récupérer le type d'export
    const { type } = await request.json()
    
    if (!type || !['csv', 'pdf', 'productivity-report'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid export type' },
        { status: 400 }
      )
    }

    // 3. Enregistrer l'export
    const success = await recordExport(user.id || user._id, type)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to record export' },
        { status: 500 }
      )
    }

    // 4. Retourner la réponse
    return NextResponse.json({
      success: true,
      message: 'Export recorded successfully'
    })

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'export:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
