import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import Session from '../../../models/session'
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

    // Récupérer les sessions/appareils connectés pour cet utilisateur
    // Trier par date de création décroissante
    const devices = await Session.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean()

    // Formater les données pour le frontend
    const formattedDevices = devices.map(device => ({
      _id: device._id.toString(),
      device: device.device || 'Appareil inconnu',
      browser: device.browser || 'Navigateur inconnu',
      ip: device.ip || 'IP inconnue',
      createdAt: device.createdAt
    }))

    return NextResponse.json(formattedDevices, { status: 200 })
  } catch (error) {
    console.error('Error fetching connected devices:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des appareils connectés' },
      { status: 500 }
    )
  }
}
