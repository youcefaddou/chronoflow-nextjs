import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { connectMongo } from '../../../../../lib/mongodb'
import User from '../../../../../models/user'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // userId
    const error = searchParams.get('error')

    // Vérifier s'il y a une erreur
    if (error) {
      console.error('[Google Calendar Callback] Erreur OAuth:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=error`)
    }

    // Vérifier les paramètres requis
    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=error`)
    }

    // Configuration OAuth2 Google
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`
    )

    // Échanger le code contre les tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Récupérer les informations de l'utilisateur Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()    // Connecter à la base de données
    await connectMongo()    // Mettre à jour l'utilisateur avec les tokens Google Calendar (comme dans /chrono)
    await User.findByIdAndUpdate(state, {
      googleCalendarTokens: tokens,
      googleCalendar: {
        connected: true,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        email: userInfo.email,
        connectedAt: new Date()
      }
    })

    console.log(`[Google Calendar] Connexion réussie pour l'utilisateur ${state}`)

    // Rediriger vers la page d'intégrations avec succès
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=success`)

  } catch (error) {
    console.error('[Google Calendar Callback] Erreur:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=error`)
  }
}
