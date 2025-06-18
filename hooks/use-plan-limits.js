'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/auth-context'

// Définition des limites par plan
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
 * Hook personnalisé pour gérer les limitations selon le plan
 */
export function usePlanLimits() {
  const { user } = useAuth()
  const [userPlan, setUserPlan] = useState('free')
  const [userStats, setUserStats] = useState({
    tasksCount: 0,
    exportsThisMonth: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  // Récupérer le plan et les statistiques de l'utilisateur
  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setUserStats({ tasksCount: 0, exportsThisMonth: 0 })
        setUserPlan('free')
        setIsLoading(false)
        return
      }
      setIsLoading(true)

      try {
        // Récupérer l'abonnement
        const subscriptionResponse = await fetch('/api/user/subscription')
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()
          const plan = subscriptionData.subscription?.plan || 'free'
          setUserPlan(plan)
        } else {
          setUserPlan('free')
        }

        // Récupérer les statistiques des tâches
        const tasksResponse = await fetch('/api/tasks')
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          const taskCount = tasksData.length || 0
          setUserStats(prev => ({
            ...prev,
            tasksCount: taskCount
          }))
        } else {
          setUserStats(prev => ({
            ...prev,
            tasksCount: 0
          }))
        }

        // TODO: Récupérer le nombre d'exports ce mois-ci
        // Cette donnée devrait être stockée en base de données
        
      } catch (error) {
        console.error('🔍 usePlanLimits: Error loading user data:', error)
        // En cas d'erreur, utiliser des valeurs par défaut
        setUserPlan('free')
        setUserStats({ tasksCount: 0, exportsThisMonth: 0 })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free

  // Fonctions de vérification des limites
  const canCreateTask = () => {
    return userStats.tasksCount < limits.maxTasks
  }

  const canExport = () => {
    return userStats.exportsThisMonth < limits.maxExportsPerMonth
  }

  const hasFeature = (feature) => {
    return limits[feature] || false
  }

  const getRemainingTasks = () => {
    if (limits.maxTasks === Infinity) return Infinity
    return Math.max(0, limits.maxTasks - userStats.tasksCount)
  }

  const getRemainingExports = () => {
    if (limits.maxExportsPerMonth === Infinity) return Infinity
    return Math.max(0, limits.maxExportsPerMonth - userStats.exportsThisMonth)
  }

  const getUsagePercentage = (type) => {
    switch (type) {
      case 'tasks':
        if (limits.maxTasks === Infinity) return 0
        return Math.min(100, (userStats.tasksCount / limits.maxTasks) * 100)
      case 'exports':
        if (limits.maxExportsPerMonth === Infinity) return 0
        return Math.min(100, (userStats.exportsThisMonth / limits.maxExportsPerMonth) * 100)
      default:
        return 0
    }
  }

  // Messages d'erreur pour les limitations
  const getLimitMessage = (type) => {
    switch (type) {
      case 'tasks':
        return `Limite atteinte ! Vous ne pouvez créer que ${limits.maxTasks} tâches avec le plan ${userPlan}. Passez au plan Pro pour des tâches illimitées.`
      case 'exports':
        return `Limite d'export atteinte ! Vous ne pouvez exporter que ${limits.maxExportsPerMonth} fois par mois avec le plan ${userPlan}.`
      case 'calendar':
        return `L'intégration calendrier n'est disponible qu'avec le plan Pro.`
      case 'reports':
        return `Les rapports avancés ne sont disponibles qu'avec le plan Pro.`
      default:
        return `Cette fonctionnalité n'est pas disponible avec votre plan actuel.`
    }
  }
  // Fonction pour mettre à jour les statistiques après création/suppression
  const updateStats = (type, increment = true) => {
    setUserStats(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }))
  }

  return {
    userPlan,
    limits,
    userStats,
    isLoading,
    loading: isLoading, // Alias pour compatibilité
    taskCount: userStats.tasksCount || 0, // Alias pour TaskLimitProgressBar avec valeur par défaut
    maxTasks: limits.maxTasks || 5, // Propriété directe pour faciliter l'accès avec valeur par défaut
    exportCount: userStats.exportsThisMonth || 0, // Alias pour exports avec valeur par défaut
    maxExports: limits.maxExportsPerMonth || 1, // Propriété directe avec valeur par défaut
    canCreateTask,
    canExport,
    hasFeature,
    getRemainingTasks,
    getRemainingExports,
    getUsagePercentage,
    getLimitMessage,
    updateStats
  }
}

export default usePlanLimits
