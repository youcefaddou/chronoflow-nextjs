import { NextResponse } from 'next/server'
import { connectMongo } from '../../../lib/mongoose.js'
import Task from '../../../models/task.js'
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
    console.error('Auth error:', error)
    throw new Error('Invalid token')
  }
}

export async function GET(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    
    const tasks = await Task.find({ userId: user.id })
    const mapped = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      start: task.start ? task.start.toISOString() : null,
      end: task.end ? task.end.toISOString() : null,
      color: task.color,
      userId: task.userId,
      isFinished: task.isFinished,
      durationSeconds: task.durationSeconds,
      _id: task._id.toString(),
    }))
    
    return NextResponse.json(mapped)  } catch (err) {
    console.error('GET /api/tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 401 })
  }
}

export async function POST(request) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const body = await request.json()
    
    const { title, description, start, end, color, durationSeconds, isFinished } = body
    
    const task = await Task.create({
      title,
      description,
      start,
      end,
      color,
      userId: user.id,
      isFinished: isFinished === true,
      durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : 0,
    })
    
    return NextResponse.json(task, { status: 201 })  } catch (err) {
    console.error('POST /api/tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}