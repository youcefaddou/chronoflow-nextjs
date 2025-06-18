import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../lib/mongoose.js'
import User from '../../../../models/user.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

async function getUser(request) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      throw new Error('No token found')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    
    // S'assurer que userId est un ObjectId valide
    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      throw new Error('Invalid user ID in token')
    }
    
    return { 
      id: decoded.userId,
      objectId: new mongoose.Types.ObjectId(decoded.userId)
    }
  } catch (error) {
    console.error('Auth error:', error)
    throw new Error('Invalid token')
  }
}

export async function DELETE(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    // Vérifier que l'utilisateur existe dans la base de données
    const existingUser = await User.findById(user.objectId)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { 
        success: true, 
        message: 'Toutes les données ont été supprimées avec succès',
        userId: user.id,
        deleted: {
          googleEvents: deletedGoogleEvents.deletedCount,
          tasks: deletedTasks.deletedCount,
          loginLogs: deletedLoginLogs.deletedCount,
          sessions: deletedSessions.deletedCount,
          user: 1
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user data:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression des données',
        details: error.message 
      },
      { status: error.message === 'Invalid token' ? 401 : 500 }
    )
  }
}
