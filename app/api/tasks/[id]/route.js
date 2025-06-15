import { NextResponse } from 'next/server'
import { connectMongo } from '../../../../lib/mongoose.js'
import Task from '../../../../models/task.js'
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

export async function PUT(request, { params }) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const { id } = params
    const update = await request.json()
    
    // Force camelCase for duration
    if ('durationSeconds' in update && typeof update.durationSeconds !== 'number') {
      update.durationSeconds = Number(update.durationSeconds) || 0
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: user.id }, 
      update, 
      { new: true }
    )
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json(task)  } catch (err) {
    console.error('PUT /api/tasks/[id] error:', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const { id } = params
    
    await Task.deleteOne({ _id: id, userId: user.id })
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/tasks/[id] error:', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function GET(request, { params }) {
  try {
    await connectMongo()
    const user = await getUser(request)
    const { id } = params
    
    const task = await Task.findOne({ _id: id, userId: user.id })
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json(task)
  } catch (err) {
    console.error('GET /api/tasks/[id] error:', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}