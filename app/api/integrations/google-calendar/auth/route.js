import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import jwt from 'jsonwebtoken'

// Scopes requis
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email'
]

export async function GET(request) {
  try {
    // Vérifier l'authentification
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtError) {
      console.error('[Google Auth] Erreur JWT:', jwtError)
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }   
     const userId = decoded.userId


    // Configuration OAuth2 client (pour Google Calendar)
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI
    )

    // Générer l'URL d'autorisation (approche identique à l'ancien projet)
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: userId
    })
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('[Google Auth] Erreur:', error)
    return NextResponse.json({ error: 'Erreur lors de la génération de l\'URL d\'autorisation' }, { status: 500 })
  }
}
