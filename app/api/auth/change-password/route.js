import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
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

export async function POST(request) {
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
    const userData = await User.findById(user.id)
    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur a un mot de passe (connexion classique)
    if (!userData.password) {
      return NextResponse.json(
        { error: 'Votre compte est connecté via Google. Vous ne pouvez pas changer votre mot de passe ici.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { oldPassword, newPassword } = body

    // Validation
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Ancien et nouveau mot de passe sont requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await bcrypt.compare(oldPassword, userData.password)
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: 'Ancien mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Mettre à jour le mot de passe
    await User.findByIdAndUpdate(user.id, {
      password: hashedNewPassword,
      updatedAt: new Date()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mot de passe modifié avec succès' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    )
  }
}

