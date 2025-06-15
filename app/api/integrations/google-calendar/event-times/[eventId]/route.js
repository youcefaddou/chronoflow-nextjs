import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../../../lib/mongoose.js'
import GoogleEventTime from '../../../../../../models/google-event-time.js'
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

export async function GET(request, { params }) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const { eventId } = params
    
    if (!eventId) {
      return NextResponse.json({ error: 'eventId requis' }, { status: 400 })
    }
    
    const eventTime = await GoogleEventTime.findOne({ userId: user.id, eventId })
    
    if (!eventTime) {
      return NextResponse.json({ error: 'Event time not found' }, { status: 404 })
    }
    
    return NextResponse.json(eventTime)
  } catch (error) {
    console.error('[GoogleEventTime][GET by ID] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération du temps Google Calendar' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const { eventId } = params
    const body = await request.json()
    
    if (!eventId) {
      return NextResponse.json({ error: 'eventId requis' }, { status: 400 })
    }
    
    const updated = await GoogleEventTime.findOneAndUpdate(
      { userId: user.id, eventId },
      { ...body, updatedAt: new Date() },
      { new: true, upsert: true }
    )
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('[GoogleEventTime][PATCH] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour locale de l\'événement Google' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const { eventId } = params
    
    if (!eventId) {
      return NextResponse.json({ error: 'eventId requis' }, { status: 400 })
    }
    
    await GoogleEventTime.deleteOne({ userId: user.id, eventId })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[GoogleEventTime][DELETE] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression locale de l\'événement Google' }, { status: 500 })
  }
}