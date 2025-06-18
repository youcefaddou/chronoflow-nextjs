/**
 * Script d'initialisation pour créer les index MongoDB nécessaires
 * pour les limitations de plan
 * 
 * Exécutez ce script une fois pour optimiser les performances :
 * node scripts/setup-plan-limits-indexes.js
 */
import { connectDatabase } from '../lib/mongodb.js'

async function setupIndexes() {
  try {

    const db = await connectDatabase()
    
    // Index pour les tâches par utilisateur
    await db.collection('tasks').createIndex({ userId: 1 })

    // Index pour les exports par utilisateur et date
    await db.collection('exports').createIndex({ userId: 1, createdAt: -1 })

    // Index pour les utilisateurs et leur abonnement
    await db.collection('users').createIndex({ 'subscription.plan': 1 })
    process.exit(0)
    
  } catch (error) {
    console.error(' Erreur lors de la configuration des index:', error)
    process.exit(1)
  }
}
setupIndexes()

export { setupIndexes }
