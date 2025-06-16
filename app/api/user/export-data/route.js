import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../lib/mongoose.js'
import User from '../../../../models/user.js'
import Task from '../../../../models/task.js'

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
    
    // Récupérer les vraies données utilisateur depuis la base de données
    const userProfile = await User.findById(user.id).select('username email createdAt lastSignInAt')
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les tâches de l'utilisateur
    const userTasks = await Task.find({ userId: user.id }).lean()

    // Construire les données d'export avec les vraies données
    const userData = {
      user: {
        id: userProfile._id,
        username: userProfile.username,
        email: userProfile.email,
        createdAt: userProfile.createdAt.toISOString(),
        lastSignInAt: userProfile.lastSignInAt ? userProfile.lastSignInAt.toISOString() : null,
      },
      tasks: userTasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description || '',
        completed: task.completed || false,
        createdAt: task.createdAt.toISOString(),
        timeSpent: task.timeSpent || 0,
        priority: task.priority || 'medium',
        category: task.category || 'general'
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }    // Créer un blob JSON avec les vraies données
    const jsonData = JSON.stringify(userData, null, 2)
    
    // Retourner le fichier JSON
    return new Response(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="chronoflow-data-${userProfile.username}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Error exporting user data:', error)
    if (error.message === 'Invalid token' || error.message === 'No token found') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des données' },
      { status: 500 }
    )
  }
}
