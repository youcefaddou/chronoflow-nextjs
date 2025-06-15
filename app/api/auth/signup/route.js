import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../lib/mongodb'
import User from '../../../../models/user'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, username, password } = await request.json()

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectMongo()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = new User({
      email,
      username,
      password: hashedPassword,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      },
      { status: 201 }
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
