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
      return
    }

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required')
    }

    await mongoose.connect(mongoUri)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

async function createIndexes() {
  try {
    // Index pour les tâches par utilisateur (comptage rapide)
    await Task.collection.createIndex({ userId: 1 }, { 
      background: true,
      name: 'userId_1_plan_limits'
    })
    // Index pour les exports par utilisateur et date (comptage rapide)
    await Export.collection.createIndex({ userId: 1, createdAt: -1 }, { 
      background: true,
      name: 'userId_1_createdAt_-1_plan_limits'
    })
    // Index pour les abonnements (requêtes de plan)
    await User.collection.createIndex({ 'subscription.plan': 1 }, { 
      background: true,
      name: 'subscription_plan_1'
    })
    // Index pour les customers Stripe
    await User.collection.createIndex({ 'subscription.stripeCustomerId': 1 }, { 
      background: true,
      sparse: true,
      name: 'stripe_customer_id_1'
    })
    // S'assurer que les index des schémas sont créés
    await Task.ensureIndexes()
    await Export.ensureIndexes()
    await User.ensureIndexes()
    // Afficher les statistiques des index
    await showIndexStats()
    
  } catch (error) {
    console.error('Error creating indexes:', error)
    throw error
  }
}

async function main() {
  try {
    await connectDatabase()
    await createIndexes()
    process.exit(0)
    
  } catch (error) {
    console.error('Indexation failed:', error)
    process.exit(1)
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
  }
}

// Gestion des signaux pour fermer proprement la connexion
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close()
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
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
