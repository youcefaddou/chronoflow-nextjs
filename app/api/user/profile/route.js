import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../lib/mongoose.js'
import User from '../../../../models/user.js'

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
    await connectMongo()
    const user = await getUser(request)
    
    // Récupérer les données du profil utilisateur depuis la base de données
    const userProfile = await User.findById(user.id).select('username email createdAt lastSignInAt')
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }    return NextResponse.json({
      id: userProfile._id,
      username: userProfile.username,
      email: userProfile.email,
      createdAt: userProfile.createdAt.toISOString(),
      lastSignInAt: userProfile.lastSignInAt ? userProfile.lastSignInAt.toISOString() : null,
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    if (error.message === 'Invalid token' || error.message === 'No token found') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors du chargement du profil' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const body = await request.json()
    const { username } = body

    // Validation
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom d\'utilisateur est requis' },
        { status: 400 }
      )
    }

    if (username.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom d\'utilisateur doit contenir au moins 2 caractères' },
        { status: 400 }
      )
    }

    // Mettre à jour le nom d'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { username: username.trim() },
      { new: true, select: 'username email createdAt lastSignInAt' }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const updatedProfile = {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt.toISOString(),
      lastSignInAt: updatedUser.lastSignInAt ? updatedUser.lastSignInAt.toISOString() : null,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    console.error('Error updating user profile:', error)
    if (error.message === 'Invalid token' || error.message === 'No token found') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}
