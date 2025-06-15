import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../lib/mongodb'
import User from '../../../../models/user'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'fallback-secret')
    
    // Connect to MongoDB
    await connectMongo()

    // Find user
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { message: 'Token invalide' },
      { status: 401 }
    )
  }
}
