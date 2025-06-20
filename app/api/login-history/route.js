import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import LoginLog from '../../../models/login-log'
import { connectMongo } from '../../../lib/mongoose'

async function getUser(request) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      throw new Error('No token found')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    return { id: decoded.userId }
  } catch (error) {
    console.error('Auth error:', error)
    throw new Error('Invalid token')
  }
}

export async function GET(request) {
  try {
    // Vérifier l'authentification
    const user = await getUser(request)
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Connexion à la base de données
    await connectMongo()

    // Récupérer l'historique des connexions pour cet utilisateur
    // Limiter aux 50 dernières connexions et trier par date décroissante
    const loginHistory = await LoginLog.find({ userId: user.id })
      .sort({ date: -1 })
      .limit(50)
      .lean()

    // Formater les données pour le frontend
    const formattedHistory = loginHistory.map(log => ({
      _id: log._id.toString(),
      date: log.date,
      ip: log.ip || 'IP inconnue',
      device: log.device || 'Appareil inconnu',
      success: log.success
    }))

    return NextResponse.json(formattedHistory, { status: 200 })
  } catch (error) {
    console.error('Error fetching login history:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'historique des connexions' },
      { status: 500 }
    )
  }
}
