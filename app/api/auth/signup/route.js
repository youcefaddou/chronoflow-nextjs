import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../lib/mongoose'
import User from '../../../../models/user'
import LoginLog from '../../../../models/login-log'
import Session from '../../../../models/session'
import { NextResponse } from 'next/server'

// Fonction pour extraire l'IP du client
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'IP inconnue'
}

// Fonction pour extraire les informations de l'appareil
function getDeviceInfo(request) {
  const userAgent = request.headers.get('user-agent') || ''
  
  // Extraction simple du navigateur et OS
  let browser = 'Navigateur inconnu'
  let os = 'OS inconnu'
  
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari'
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge'
  }
  
  if (userAgent.includes('Windows')) {
    os = 'Windows'
  } else if (userAgent.includes('Mac')) {
    os = 'macOS'
  } else if (userAgent.includes('Linux')) {
    os = 'Linux'
  } else if (userAgent.includes('Android')) {
    os = 'Android'
  } else if (userAgent.includes('iOS')) {
    os = 'iOS'
  }
  
  return `${browser} sur ${os}`
}

export async function POST(request) {
  const clientIP = getClientIP(request)
  const deviceInfo = getDeviceInfo(request)
  
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

    await user.save()    // Enregistrer la première connexion (inscription)
    try {
      await LoginLog.create({
        userId: user._id,
        date: new Date(),
        ip: clientIP,
        device: deviceInfo,
        success: true
      })
    } catch (logError) {
      console.error('Error logging signup:', logError)
    }

    // Créer la première session de l'appareil
    try {
      await Session.create({
        userId: user._id,
        device: deviceInfo,
        browser: deviceInfo, // Pour compatibilité avec le schéma
        ip: clientIP,
        createdAt: new Date()
      })
    } catch (sessionError) {
      console.error('Error creating first session:', sessionError)
    }

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
