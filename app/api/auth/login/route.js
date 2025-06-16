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
  let userId = null
  
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectMongo()

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      // Enregistrer la tentative de connexion échouée
      if (email) {
        try {
          const tempUser = await User.findOne({ email })
          if (tempUser) {
            await LoginLog.create({
              userId: tempUser._id,
              date: new Date(),
              ip: clientIP,
              device: deviceInfo,
              success: false
            })
          }
        } catch (logError) {
          console.error('Error logging failed attempt:', logError)
        }
      }
      
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    userId = user._id

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      // Enregistrer la tentative de connexion échouée
      try {
        await LoginLog.create({
          userId: user._id,
          date: new Date(),
          ip: clientIP,
          device: deviceInfo,
          success: false
        })
      } catch (logError) {
        console.error('Error logging failed attempt:', logError)
      }
      
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Update last sign in date
    await User.findByIdAndUpdate(user._id, { 
      lastSignInAt: new Date() 
    })    // Enregistrer la connexion réussie
    try {
      await LoginLog.create({
        userId: user._id,
        date: new Date(),
        ip: clientIP,
        device: deviceInfo,
        success: true
      })
    } catch (logError) {
      console.error('Error logging successful login:', logError)
    }

    // Créer ou mettre à jour la session de l'appareil
    try {
      // Vérifier si une session existe déjà pour cet appareil/IP
      const existingSession = await Session.findOne({
        userId: user._id,
        ip: clientIP,
        device: deviceInfo
      })

      if (!existingSession) {
        // Créer une nouvelle session si elle n'existe pas
        await Session.create({
          userId: user._id,
          device: deviceInfo,
          browser: deviceInfo, // Pour compatibilité avec le schéma
          ip: clientIP,
          createdAt: new Date()
        })
      }
    } catch (sessionError) {
      console.error('Error creating session:', sessionError)
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )// Create response
    const response = NextResponse.json(
      { 
        message: 'Connexion réussie',
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      },
      { status: 200 }
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
    console.error('Login error:', error)
    
    // En cas d'erreur serveur, essayer quand même d'enregistrer l'échec si on a un userId
    if (userId) {
      try {
        await LoginLog.create({
          userId,
          date: new Date(),
          ip: clientIP,
          device: deviceInfo,
          success: false
        })
      } catch (logError) {
        console.error('Error logging server error attempt:', logError)
      }
    }
    
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
