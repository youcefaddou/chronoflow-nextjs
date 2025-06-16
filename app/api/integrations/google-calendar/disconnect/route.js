import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../../lib/mongodb'
import User from '../../../../../models/user'

export async function POST(request) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token d\'authentification requis' }, { status: 401 })
    }    // Vérifier le JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }// Connecter à la base de données
    await connectMongo()    // Déconnecter Google Calendar pour l'utilisateur (comme dans /chrono)
    await User.findByIdAndUpdate(decoded.userId, {
      $unset: {
        googleCalendarTokens: 1,
        googleCalendar: 1
      }
    })

    console.log(`[Google Calendar] Déconnexion pour l'utilisateur ${decoded.userId}`)

    return NextResponse.json({ success: true, message: 'Google Calendar déconnecté avec succès' })

  } catch (error) {
    console.error('[Google Calendar Disconnect] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
