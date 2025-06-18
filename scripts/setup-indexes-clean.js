#!/usr/bin/env node
/**
 * Script d'indexation MongoDB pour optimiser les requêtes de limitations de plan
 * Ce script crée les index nécessaires pour accélérer les requêtes de comptage
 * utilisées par le système de limitations (tâches, exports)
 * 
 * Usage: npm run setup-indexes
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Task from '../models/task.js'
import Export from '../models/export.js'
import User from '../models/user.js'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

async function connectDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      return
    }

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is required')

      throw new Error('MONGODB_URI environment variable is required')
    }
    await mongoose.connect(mongoUri)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    throw error
  }
}

async function createIndexes() {
  try {
    // Index pour les tâches par utilisateur (comptage rapide)
    try {
      await Task.collection.createIndex({ userId: 1 }, { 
        background: true,
        name: 'userId_1_plan_limits'
      })
    } catch (error) {
      if (error.code === 85) { // Index already exists
      } else {
        throw error
      }
    }

    // Index pour les exports par utilisateur et date (comptage rapide)
    try {
      await Export.collection.createIndex({ userId: 1, createdAt: -1 }, { 
        background: true,
        name: 'userId_1_createdAt_-1_plan_limits'
      })
    } catch (error) {
      if (error.code === 85) { // Index already exists
      } else {
        throw error
      }
    }

    // Index pour les abonnements (requêtes de plan)
    try {
      await User.collection.createIndex({ 'subscription.plan': 1 }, { 
        background: true,
        name: 'subscription_plan_1'
      })
    } catch (error) {
      if (error.code === 85) { // Index already exists
      } else {
        throw error
      }
    }

    // Index pour les customers Stripe
    try {
      await User.collection.createIndex({ 'subscription.stripeCustomerId': 1 }, { 
        background: true,
        sparse: true,
        name: 'stripe_customer_id_1'
      })
    } catch (error) {
      if (error.code === 85) { // Index already exists
      } else {
        throw error
      }
    }

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
    console.log('Starting MongoDB indexation for plan limits...')
    console.log('Current working directory:', process.cwd())
    console.log('Script path:', import.meta.url)
    
    await connectDatabase()
    await createIndexes()
    
    console.log('Indexation completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('Indexation failed:', error.message)
    console.error('Stack trace:', error.stack)
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

main()

export { createIndexes, showIndexStats, main as setupIndexes }
