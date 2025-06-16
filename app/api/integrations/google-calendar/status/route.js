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
    }

    // Vérifier le JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }    // Connecter à la base de données
    await connectMongo()

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId).select('googleCalendar')

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Retourner le statut de connexion
    const status = {
      connected: user.googleCalendar?.connected || false,
      email: user.googleCalendar?.email || null,
      connectedAt: user.googleCalendar?.connectedAt || null
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
