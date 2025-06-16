import { NextResponse } from 'next/server'
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
      console.error('[Google Calendar Callback] Code ou state manquant')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=error`)
    }    console.log('[Google Calendar Callback] Code reçu:', code.substring(0, 20) + '...')
    console.log('[Google Calendar Callback] State (userId):', state)

    // Diagnostic des paramètres
    console.log('[Google Calendar Callback] DIAGNOSTIC:')
    console.log('  - Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...')
    console.log('  - Client Secret présent:', !!process.env.GOOGLE_CLIENT_SECRET)
    console.log('  - Redirect URI:', process.env.GOOGLE_CALENDAR_REDIRECT_URI)
    console.log('  - Code length:', code.length)

    try {
      // Échanger le code contre les tokens (approche HTTP directe comme le login principal)
      console.log('[Google Calendar Callback] Début échange token avec approche HTTP directe...')
      
      const tokenParams = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_CALENDAR_REDIRECT_URI
      })

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams.toString()
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenResponse.ok) {
        console.error('[Google Calendar Callback] Erreur échange token:', tokenData)
        throw new Error(`Token exchange failed: ${tokenData.error_description || tokenData.error}`)
      }

      const tokens = tokenData
      console.log('[Google Calendar Callback] Tokens reçus avec succès via HTTP direct')

      // Connecter à la base de données
      await connectMongo()

      // Stocker les tokens dans le profil utilisateur
      await User.findByIdAndUpdate(state, {
        googleCalendarTokens: tokens
      })

      console.log(`[Google Calendar] Connexion réussie pour l'utilisateur ${state}`)

      // Rediriger vers la page d'intégrations avec succès
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=success`)

    } catch (tokenError) {
      console.error('[Google Calendar Callback] Erreur échange token:', tokenError)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=error`)
    }

  } catch (error) {
    console.error('[Google Calendar Callback] Erreur générale:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/integrations?google=error`)
  }
}
