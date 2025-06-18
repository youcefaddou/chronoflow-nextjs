/**
 * Vérifications de limitations côté serveur pour la sécurité
 */

import Task from '../models/task.js'
import User from '../models/user.js'
import Export from '../models/export.js'

// Définition des limites par plan (identique au frontend)
const PLAN_LIMITS = {
  free: {
    maxTasks: 5,
    maxExportsPerMonth: 1,
    hasCalendarIntegration: false,
    hasAdvancedReports: false,
    hasCustomNotifications: false,
    hasAutoBackup: false,
    hasPrioritySupport: false,
    hasTeamFeatures: false,
  },
  pro: {
    maxTasks: Infinity,
    maxExportsPerMonth: Infinity,
    hasCalendarIntegration: true,
    hasAdvancedReports: true,
    hasCustomNotifications: true,
    hasAutoBackup: true,
    hasPrioritySupport: true,
    hasTeamFeatures: false,
  },
  business: {
    maxTasks: Infinity,
    maxExportsPerMonth: Infinity,
    hasCalendarIntegration: true,
    hasAdvancedReports: true,
    hasCustomNotifications: true,
    hasAutoBackup: true,
    hasPrioritySupport: true,
    hasTeamFeatures: true,
  }
}

/**
 * Récupère le plan de l'utilisateur
 * @param {Object} user - L'utilisateur (peut être un objet complet ou juste un ID)
 * @returns {Promise<string>} Le plan de l'utilisateur
 */
async function getUserPlan(user) {
  if (!user) return 'free'
  
  try {
    // Si l'utilisateur a déjà les données subscription, on les utilise
    if (user.subscription?.plan) {
      return user.subscription.plan
    }
    
    // Sinon, on récupère depuis la base de données
    const userId = user._id || user.id
    const userData = await User.findById(userId).select('subscription.plan')
    
    return userData?.subscription?.plan || 'free'
  } catch (error) {
    console.error('Erreur lors de la récupération du plan utilisateur:', error)
    return 'free'
  }
}

/**
 * Compte le nombre de tâches de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<number>} Nombre de tâches
 */
async function getUserTasksCount(userId) {
  try {
    const count = await Task.countDocuments({ userId: userId })
    return count
  } catch (error) {
    console.error('Erreur lors du comptage des tâches:', error)
    return 0
  }
}

/**
 * Compte le nombre d'exports de l'utilisateur ce mois-ci
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<number>} Nombre d'exports ce mois
 */
async function getUserExportsThisMonth(userId) {
  try {
    // Calcul du début du mois actuel
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Compter les exports de ce mois avec Mongoose
    const count = await Export.countDocuments({ 
      userId: userId,
      createdAt: { $gte: startOfMonth }
    })
    
    return count
  } catch (error) {
    console.error('Erreur lors du comptage des exports:', error)
    return 0
  }
}

/**
 * Vérifie si l'utilisateur peut créer une nouvelle tâche
 * @param {Object} user - L'utilisateur
 * @returns {Promise<{allowed: boolean, reason?: string}>}
 */
export async function canCreateTask(user) {
  if (!user) {
    return { allowed: false, reason: 'User not authenticated' }
  }

  const userPlan = await getUserPlan(user)
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free
  
  if (limits.maxTasks === Infinity) {
    return { allowed: true }
  }

  const currentTasksCount = await getUserTasksCount(user.id || user._id)
  
  if (currentTasksCount >= limits.maxTasks) {
    return { 
      allowed: false, 
      reason: `Task limit reached. Maximum ${limits.maxTasks} tasks allowed for ${userPlan} plan.` 
    }
  }

  return { allowed: true }
}

/**
 * Vérifie si l'utilisateur peut exporter
 * @param {Object} user - L'utilisateur
 * @returns {Promise<{allowed: boolean, reason?: string}>}
 */
export async function canExport(user) {
  if (!user) {
    return { allowed: false, reason: 'User not authenticated' }
  }

  const userPlan = await getUserPlan(user)
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free
  
  if (limits.maxExportsPerMonth === Infinity) {
    return { allowed: true }
  }

  const currentExportsCount = await getUserExportsThisMonth(user.id || user._id)
  
  if (currentExportsCount >= limits.maxExportsPerMonth) {
    return { 
      allowed: false, 
      reason: `Export limit reached. Maximum ${limits.maxExportsPerMonth} exports per month allowed for ${userPlan} plan.` 
    }
  }

  return { allowed: true }
}

/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité
 * @param {Object} user - L'utilisateur
 * @param {string} feature - La fonctionnalité à vérifier
 * @returns {Promise<boolean>}
 */
export async function hasFeature(user, feature) {
  if (!user) return false

  const userPlan = await getUserPlan(user)
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free
  
  return limits[feature] || false
}

/**
 * Enregistre un export dans la base de données
 * @param {string} userId - ID de l'utilisateur
 * @param {string} type - Type d'export ('csv', 'pdf', 'productivity-report')
 * @returns {Promise<boolean>} Succès de l'enregistrement
 */
export async function recordExport(userId, type = 'csv') {
  try {
    const exportRecord = new Export({
      userId: userId,
      type: type,
      createdAt: new Date()
    })
    
    await exportRecord.save()
    return true
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'export:', error)
    return false
  }
}

/**
 * Middleware pour vérifier les limitations avant création de tâche
 */
export function checkTaskCreationLimit() {
  return async (req, res, next) => {
    try {
      const user = req.user // Supposons que l'utilisateur est dans req.user
      const check = await canCreateTask(user)
      
      if (!check.allowed) {
        return res.status(403).json({
          error: 'Task creation limit reached',
          message: check.reason,
          type: 'PLAN_LIMIT_EXCEEDED'
        })
      }
      
      next()
    } catch (error) {
      console.error('Erreur lors de la vérification des limites:', error)
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to check plan limits'
      })
    }
  }
}

/**
 * Middleware pour vérifier les limitations avant export
 */
export function checkExportLimit() {
  return async (req, res, next) => {
    try {
      const user = req.user // Supposons que l'utilisateur est dans req.user
      const check = await canExport(user)
      
      if (!check.allowed) {
        return res.status(403).json({
          error: 'Export limit reached',
          message: check.reason,
          type: 'PLAN_LIMIT_EXCEEDED'
        })
      }
      
      next()
    } catch (error) {
      console.error('Erreur lors de la vérification des limites:', error)
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to check plan limits'
      })
    }
  }
}

const planLimitsServer = {
  canCreateTask,
  canExport,
  hasFeature,
  recordExport,
  checkTaskCreationLimit,
  checkExportLimit,
  PLAN_LIMITS
}

export default planLimitsServer
