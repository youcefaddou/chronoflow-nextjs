import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../../lib/mongoose.js'
import User from '../../../../../models/user.js'
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

export async function GET(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    
    const dbUser = await User.findById(user.id)
    if (!dbUser || !dbUser.googleCalendarTokens) {
      return NextResponse.json({ error: 'Google Calendar non connecté' }, { status: 400 })
    }

    oauth2Client.setCredentials(dbUser.googleCalendarTokens)
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Get events for next 30 days
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

    const events = response.data.items.map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      status: event.status,
      creator: event.creator,
      attendees: event.attendees,
      htmlLink: event.htmlLink,
    }))

    return NextResponse.json(events)
  } catch (error) {
    console.error('[Google Calendar][Events] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des événements Google Calendar' }, { status: 500 })
  }
}