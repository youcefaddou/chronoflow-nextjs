import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../../lib/mongodb'
import User from '../../../../../models/user'
import GoogleEventTime from '../../../../../models/google-event-time'
import { google } from 'googleapis'
import jwt from 'jsonwebtoken'

async function getUser(request) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      throw new Error('No token found')
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    return { id: decoded.userId }
  } catch (error) {
    throw new Error('Invalid token')
  }
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
)

export async function POST(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    
    const dbUser = await User.findById(user.id)
    if (!dbUser || !dbUser.googleCalendarTokens) {
      return NextResponse.json({ error: 'Google Calendar non connecté' }, { status: 400 })
    }

    oauth2Client.setCredentials(dbUser.googleCalendarTokens)
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const now = new Date()
    const maxDate = new Date()
    maxDate.setDate(now.getDate() + 30)

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: maxDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []
    let imported = 0

    for (const event of events) {
      if (!event.id) continue

      // Check if already exists
      const existing = await GoogleEventTime.findOne({ 
        userId: user.id, 
        eventId: event.id 
      })

      if (!existing) {
        await GoogleEventTime.create({
          userId: user.id,
          eventId: event.id,
          title: event.summary || 'Événement sans titre',
          description: event.description || '',
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          durationSeconds: 0,
          isFinished: false,
        })
        imported++
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported, 
      total: events.length 
    })
  } catch (error) {
    console.error('[Google Calendar][Import] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'import des événements Google Calendar' }, { status: 500 })
  }
}