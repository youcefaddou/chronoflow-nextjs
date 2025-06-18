import mongoose from 'mongoose'

const exportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['csv', 'pdf', 'productivity-report'],
    default: 'csv'
  },
  createdAt: { type: Date, default: Date.now }
})

// Index pour optimiser les requêtes de comptage
exportSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Export || mongoose.model('Export', exportSchema)
