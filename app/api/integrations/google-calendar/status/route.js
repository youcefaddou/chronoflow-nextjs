import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../../lib/mongodb'
import User from '../../../../../models/user'

export async function GET(request) {
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
    }    // Connecter à la base de données
    await connectMongo()

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId).select('googleCalendarTokens')

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Vérifier si l'utilisateur a des tokens Google Calendar
    const hasTokens = user.googleCalendarTokens && 
                     user.googleCalendarTokens.access_token && 
                     user.googleCalendarTokens.refresh_token

    // Retourner le statut de connexion
    const status = {
      connected: !!hasTokens,
      email: null, // On peut récupérer l'email plus tard si nécessaire
      connectedAt: null // Optionnel pour l'instant
    }

    return NextResponse.json(status)

  } catch (error) {
    console.error('[Google Calendar Status] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}
