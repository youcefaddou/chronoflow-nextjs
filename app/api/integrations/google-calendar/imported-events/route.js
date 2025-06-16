import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../../lib/mongodb'
import GoogleEventTime from '../../../../../models/google-event-time'
import jwt from 'jsonwebtoken'

async function getUser(request) {
  try {
    // Récupérer le token depuis les cookies ou l'en-tête Authorization
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
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
    
    if (!token) {
      throw new Error('No token found')
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { id: decoded.userId }
  } catch {
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
