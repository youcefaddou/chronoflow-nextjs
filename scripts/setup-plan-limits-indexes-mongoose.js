/**
 * SCRIPT D'OPTIMISATION MONGODB
 * 
 * POURQUOI CE SCRIPT ?
 * Votre app limite les utilisateurs gratuits à 5 tâches max.
 * Pour vérifier cette limite, on doit compter les tâches rapidement.
 * Sans index = LENT (parcourt toute la DB)
 * Avec index = RAPIDE (accès direct)
 * 
 * QUAND L'EXÉCUTER ?
 * Une seule fois après le déploiement, ou quand vous ajoutez de nouveaux index.
 * 
 * Usage: npm run setup-indexes
 */

import mongoose from 'mongoose'
import Task from '../models/task.js'
import Export from '../models/export.js'
import User from '../models/user.js'

async function connectDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('� Database already connected')
      return
    }

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required')
    }

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    throw error
  }
}

async function createIndexes() {
  try {
    console.log('� Creating indexes for plan limits optimization...')

    // Index pour les tâches par utilisateur (comptage rapide)
    await Task.collection.createIndex({ userId: 1 }, { 
      background: true,
      name: 'userId_1_plan_limits'
    })
    console.log('✅ Task userId index created')

    // Index pour les exports par utilisateur et date (comptage rapide)
    await Export.collection.createIndex({ userId: 1, createdAt: -1 }, { 
      background: true,
      name: 'userId_1_createdAt_-1_plan_limits'
    })
    console.log('✅ Export userId + createdAt index created')

    // Index pour les abonnements (requêtes de plan)
    await User.collection.createIndex({ 'subscription.plan': 1 }, { 
      background: true,
      name: 'subscription_plan_1'
    })
    console.log('✅ User subscription plan index created')

    // Index pour les customers Stripe
    await User.collection.createIndex({ 'subscription.stripeCustomerId': 1 }, { 
      background: true,
      sparse: true,
      name: 'stripe_customer_id_1'
    })
    console.log('✅ User Stripe customer ID index created')

    // S'assurer que les index des schémas sont créés
    await Task.ensureIndexes()
    await Export.ensureIndexes()
    await User.ensureIndexes()
    console.log('✅ Schema indexes ensured')

    console.log('🎉 All indexes created successfully!')
    
    // Afficher les statistiques des index
    await showIndexStats()
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    throw error
  }
}

async function showIndexStats() {
  try {
    console.log('\n📊 Index Statistics:')
    
    const taskIndexes = await Task.collection.listIndexes().toArray()
    console.log(`Tasks collection: ${taskIndexes.length} indexes`)
    taskIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
    })

    const exportIndexes = await Export.collection.listIndexes().toArray()
    console.log(`Exports collection: ${exportIndexes.length} indexes`)
    exportIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
    })

    const userIndexes = await User.collection.listIndexes().toArray()
    console.log(`Users collection: ${userIndexes.length} indexes`)
    userIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
    })

  } catch (error) {
    console.error('❌ Error showing index stats:', error)
  }
}

async function main() {
  try {
    console.log('🚀 Starting MongoDB indexation for plan limits...')
    
    await connectDatabase()
    await createIndexes()
    
    console.log('✅ Indexation completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Indexation failed:', error)
    process.exit(1)
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
      console.log('📡 Database connection closed')
    }
  }
}

// Gestion des signaux pour fermer proprement la connexion
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connection...')
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close()
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connection...')
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close()
  }
  process.exit(0)
})

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { createIndexes, showIndexStats, main as setupIndexes }
