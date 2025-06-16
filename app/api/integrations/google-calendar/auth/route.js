import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    console.log('[Google Calendar Auth] Début de la requête')
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    console.log('[Google Calendar Auth] Headers:', {
      authorization: authHeader ? 'Present' : 'Missing',
      cookie: cookieHeader ? 'Present' : 'Missing'
    })

    // Essayer de récupérer le token depuis l'en-tête Authorization ou les cookies
    let token = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '')
    } else if (cookieHeader) {
      const cookies = cookieHeader.split('; ')
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='))
      if (tokenCookie) {
        token = tokenCookie.split('=')[1]
      }
    }

    console.log('[Google Calendar Auth] Token trouvé:', token ? 'Oui' : 'Non')

    if (!token) {
      return NextResponse.json({ error: 'Token d\'authentification requis' }, { status: 401 })
    }

    // Vérifier le JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
      console.log('[Google Calendar Auth] JWT décodé:', decoded.userId)
    } catch (jwtError) {
      console.error('[Google Calendar Auth] Erreur JWT:', jwtError.message)
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Vérifier les variables d'environnement
    if (!process.env.GOOGLE_CALENDAR_CLIENT_ID || !process.env.GOOGLE_CALENDAR_CLIENT_SECRET) {
      console.error('[Google Calendar Auth] Variables d\'environnement manquantes')
      return NextResponse.json({ error: 'Configuration Google Calendar manquante' }, { status: 500 })
    }

    // Configuration OAuth2 Google
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`
    )

    console.log('[Google Calendar Auth] Callback URL:', `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`)

    // Générer l'URL d'autorisation
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email'
    ]

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: decoded.userId, // Passer l'ID utilisateur dans le state
      prompt: 'consent' // Forcer la demande de consentement pour obtenir le refresh_token
    })

    console.log('[Google Calendar Auth] URL générée avec succès')

    return NextResponse.json({ authUrl })

  } catch (error) {
    console.error('[Google Calendar Auth] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'URL d\'authentification' },
      { status: 500 }
    )
  }
}
