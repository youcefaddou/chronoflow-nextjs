import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: Date,
  color: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isFinished: { type: Boolean, default: false },
  durationSeconds: { type: Number, default: 0 },
})

// Index pour optimiser les requêtes de comptage des limitations
taskSchema.index({ userId: 1 })

export default mongoose.models.Task || mongoose.model('Task', taskSchema)
