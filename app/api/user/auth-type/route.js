import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../lib/mongoose'
import User from '../../../../models/user'

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

    // Récupérer les données utilisateur
    const userData = await User.findById(user.id).select('password googleId email')
    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Déterminer le type d'authentification
    const authType = {
      hasPassword: !!userData.password,
      hasGoogleAuth: !!userData.googleId,
      email: userData.email,
      canChangePassword: !!userData.password
    }

    return NextResponse.json(authType, { status: 200 })
  } catch (error) {
    console.error('Error fetching auth type:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du type d\'authentification' },
      { status: 500 }
    )
  }
}
