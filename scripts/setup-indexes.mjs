/**
 * SCRIPT D'OPTIMISATION MONGODB POUR LES LIMITATIONS DE PLAN
 * 
 * POURQUOI CE SCRIPT EST NÉCESSAIRE ?
 * 
 * Votre app limite les utilisateurs gratuits :
 * - 5 tâches maximum
 * - 1 export par mois maximum
 * 
 * Pour vérifier ces limites, l'app doit compter rapidement :
 * - Task.countDocuments({ userId: "123" })
 * - Export.countDocuments({ userId: "123", createdAt: ... })
 * 
 * SANS INDEX = TRÈS LENT (parcourt toute la base de données)
 * AVEC INDEX = TRÈS RAPIDE (accès direct aux données)
 * 
 * QUAND L'EXÉCUTER ?
 * - Une seule fois après le déploiement
 * - Après chaque changement de schéma
 * 
 * Usage: npm run setup-indexes
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import mongoose from 'mongoose'
import Task from '../models/task.js'
import Export from '../models/export.js'
import User from '../models/user.js'

// Charger les variables d'environnement depuis .env.local
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env.local')
    const envFile = readFileSync(envPath, 'utf8')
    
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && !key.startsWith('#') && key.trim()) {
        const value = valueParts.join('=').trim()
        if (value) {
          process.env[key.trim()] = value
        }
      }
    })
    } catch {
    console.error('Impossible de charger le fichier .env.local. Assurez-vous qu\'il existe à la racine du projet.')
  }
}

async function setupIndexes() {
  try {
    // Charger les variables d'environnement
    loadEnvFile() 
    // Vérifier que MONGODB_URI est définie
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.error('Variable MONGODB_URI manquante !')
      process.exit(1)
    }
    
    // Connexion à MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri)
    }

    // 1. Index pour compter rapidement les tâches par utilisateur
    // Utilisé par : getUserTasksCount() dans plan-limits-server.js
    await Task.collection.createIndex({ userId: 1 })
    // 2. Index pour compter rapidement les exports par utilisateur/mois
    // Utilisé par : getUserExportsThisMonth() dans plan-limits-server.js
    await Export.collection.createIndex({ userId: 1, createdAt: -1 })
    // 3. Index pour les plans d'abonnement
    // Utilisé par : getUserPlan() pour vérifier free/pro
    await User.collection.createIndex({ 'subscription.plan': 1 }) 
  } catch (error) {
    console.error('Erreur lors de la création des index:', error.message)
    process.exit(1)
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(0)
  }
}

setupIndexes()
