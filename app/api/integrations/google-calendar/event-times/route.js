import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../../lib/mongodb'
import GoogleEventTime from '../../../../../models/google-event-time'
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
    console.error('Token verification failed:', error.message)
    throw new Error('Invalid token')
  }
}

export async function GET(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    
    const eventTimes = await GoogleEventTime.find({ userId: user.id })
    return NextResponse.json(eventTimes)
  } catch (error) {
    console.error('[GoogleEventTime][GET] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des temps Google Calendar' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const body = await request.json()
    
    const { eventId, title, description, durationSeconds, start, end, isFinished } = body
    
    if (!eventId) {
      return NextResponse.json({ error: 'eventId requis' }, { status: 400 })
    }

    // Check if already exists
    const existing = await GoogleEventTime.findOne({ userId: user.id, eventId })
    
    if (existing) {
      // Update existing
      existing.title = title || existing.title
      existing.description = description || existing.description
      existing.durationSeconds = typeof durationSeconds === 'number' ? durationSeconds : existing.durationSeconds
      existing.start = start || existing.start
      existing.end = end || existing.end
      existing.isFinished = typeof isFinished === 'boolean' ? isFinished : existing.isFinished
      existing.updatedAt = new Date()
      
      await existing.save()
      return NextResponse.json(existing)
    } else {
      // Create new
      const newEventTime = await GoogleEventTime.create({
        userId: user.id,
        eventId,
        title: title || '',
        description: description || '',
        durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : 0,
        start,
        end,
        isFinished: isFinished || false,
      })
      
      return NextResponse.json(newEventTime)
    }
  } catch (error) {
    console.error('[GoogleEventTime][POST] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création/mise à jour du temps Google Calendar' }, { status: 500 })
  }
}