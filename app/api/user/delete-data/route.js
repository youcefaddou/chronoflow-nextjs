import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../lib/mongoose.js'
import Task from '../../../../models/task.js'
import User from '../../../../models/user.js'
import Session from '../../../../models/session.js'
import LoginLog from '../../../../models/login-log.js'
import GoogleEventTime from '../../../../models/google-event-time.js'
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
    
    console.log('=== DEBUT SUPPRESSION DONNEES UTILISATEUR ===')
    console.log('User ID from token:', user.id)
    console.log('User ObjectId:', user.objectId)
    
    // Vérifier que l'utilisateur existe dans la base de données
    const existingUser = await User.findById(user.objectId)
    if (!existingUser) {
      console.log('Utilisateur non trouvé avec ID:', user.id)
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }
    
    console.log('Utilisateur trouvé:', existingUser.email)
    console.log('Suppression de toutes les données pour l\'utilisateur:', user.id)
    
    // Supprimer les données dans l'ordre correct pour éviter les problèmes de contraintes
    
    // 1. Supprimer les événements Google Calendar SEULEMENT pour cet utilisateur
    console.log('Suppression des événements Google Calendar...')
    const deletedGoogleEvents = await GoogleEventTime.deleteMany({ userId: user.objectId })
    console.log(`✓ Supprimé ${deletedGoogleEvents.deletedCount} événements Google Calendar pour l'utilisateur ${user.id}`)
    
    // 2. Supprimer toutes les tâches et timers SEULEMENT pour cet utilisateur
    console.log('Suppression des tâches...')
    const deletedTasks = await Task.deleteMany({ userId: user.objectId })
    console.log(`✓ Supprimé ${deletedTasks.deletedCount} tâches pour l'utilisateur ${user.id}`)
    
    // 3. Supprimer l'historique de connexion SEULEMENT pour cet utilisateur
    console.log('Suppression de l\'historique de connexion...')
    const deletedLoginLogs = await LoginLog.deleteMany({ userId: user.objectId })
    console.log(`✓ Supprimé ${deletedLoginLogs.deletedCount} logs de connexion pour l'utilisateur ${user.id}`)
    
    // 4. Supprimer toutes les sessions actives SEULEMENT pour cet utilisateur
    console.log('Suppression des sessions...')
    const deletedSessions = await Session.deleteMany({ userId: user.objectId })
    console.log(`✓ Supprimé ${deletedSessions.deletedCount} sessions pour l'utilisateur ${user.id}`)
    
    // 5. Finalement, supprimer l'utilisateur lui-même
    console.log('Suppression de l\'utilisateur...')
    const deletedUser = await User.findByIdAndDelete(user.objectId)
    if (!deletedUser) {
      throw new Error('Échec de la suppression de l\'utilisateur')
    }    console.log('✓ Utilisateur supprimé avec succès:', deletedUser.email)
    console.log('=== FIN SUPPRESSION DONNEES UTILISATEUR ===')
    
    // Vérification finale de sécurité
    const remainingUsers = await User.countDocuments()
    console.log(`Total d'utilisateurs restants dans la DB: ${remainingUsers}`)
    
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
