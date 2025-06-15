import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../../lib/mongoose.js'
import GoogleEventTime from '../../../../../models/google-event-time.js'
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

export async function GET(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    
    const events = await GoogleEventTime.find({ userId: user.id })
    return NextResponse.json(events)
  } catch (error) {
    console.error('[GoogleEventTime][GET imported] Error:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des événements Google importés' }, { status: 500 })
  }
}
