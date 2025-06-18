'use client'

import { useTranslation } from 'react-i18next'
import { usePlanLimits } from '../../hooks/use-plan-limits'

export default function TaskLimitProgressBar() {
  const { t } = useTranslation()
  const { userPlan, userStats, limits, isLoading } = usePlanLimits()

  // Ne pas afficher pendant le chargement ou pour les plans payants
  if (isLoading || userPlan !== 'free' || !limits?.maxTasks || limits.maxTasks === Infinity) {
    return null
  }

  const taskCount = userStats?.tasksCount || 0
  const maxTasks = limits.maxTasks
  const percentage = Math.min((taskCount / maxTasks) * 100, 100)
  const isNearLimit = percentage >= 80
  const isAtLimit = taskCount >= maxTasks
  return (
    <div className="flex items-center gap-3 ml-4">
      <div className="flex items-center gap-3">
        {/* Compteur clair et visible */}
        <span className={`text-sm font-semibold ${
          isAtLimit 
            ? 'text-red-600' 
            : isNearLimit 
              ? 'text-amber-600' 
              : 'text-blue-600'
        }`}>
          {taskCount}/{maxTasks} {t('dashboard.taskLimit')}
        </span>
        
        {/* Barre de progression moderne */}
        <div className="relative">
          <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
            <div 
              className={`h-full transition-all duration-700 ease-out ${
                isAtLimit 
                  ? 'bg-red-500' 
                  : isNearLimit 
                    ? 'bg-amber-500' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Indicateur de limite atteinte */}
          {isAtLimit && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
        </div>

        {/* Badge plan gratuit - discret mais visible */}
        <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium hidden lg:inline-flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          {t('common.plans.free', 'Gratuit')}
        </div>
      </div>

      {/* Message UX quand la limite est atteinte */}
      {isAtLimit && (
        <div className="ml-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 hidden md:block">
          <p className="text-red-700 text-xs font-medium">
            {t('dashboard.taskLimitReached', 'Limite atteinte ! Supprimez une tâche ou passez au plan Pro.')}
          </p>
        </div>
      )}
    </div>
  )
}
