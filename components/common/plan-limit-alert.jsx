'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Crown, Zap, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { useRouter } from 'next/navigation'

/**
 * Composant pour afficher les alertes de limitation et encourager l'upgrade
 */
export function PlanLimitAlert({ 
  type, 
  current, 
  max, 
  percentage, 
  onUpgrade,
  className = '' 
}) {
  const { t } = useTranslation()
  const router = useRouter()

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push('/dashboard/subscription')
    }
  }

  // Seuil d'alerte (80%)
  const isWarning = percentage >= 80
  const isMaxed = percentage >= 100

  if (percentage < 80 && !isMaxed) return null

  const getIcon = () => {
    if (isMaxed) return <AlertTriangle className="h-5 w-5 text-red-500" />
    return <TrendingUp className="h-5 w-5 text-orange-500" />
  }

  const getTitle = () => {
    if (isMaxed) {
      switch (type) {
        case 'tasks':
          return t('limits.tasks.maxReached', 'Limite de tâches atteinte')
        case 'exports':
          return t('limits.exports.maxReached', 'Limite d\'exports atteinte')
        default:
          return t('limits.generic.maxReached', 'Limite atteinte')
      }
    }
    
    switch (type) {
      case 'tasks':
        return t('limits.tasks.warning', 'Attention : limite de tâches bientôt atteinte')
      case 'exports':
        return t('limits.exports.warning', 'Attention : limite d\'exports bientôt atteinte')
      default:
        return t('limits.generic.warning', 'Attention : limite bientôt atteinte')
    }
  }

  const getMessage = () => {
    if (isMaxed) {
      switch (type) {
        case 'tasks':
          return t('limits.tasks.maxMessage', 'Vous avez atteint la limite de {{max}} tâches du plan gratuit. Passez au plan Pro pour des tâches illimitées.', { max })
        case 'exports':
          return t('limits.exports.maxMessage', 'Vous avez atteint la limite de {{max}} export(s) par mois du plan gratuit.', { max })
        default:
          return t('limits.generic.maxMessage', 'Vous avez atteint votre limite.')
      }
    }
    
    return t('limits.warning.message', 'Vous utilisez {{current}}/{{max}} ({{percentage}}%). Passez au plan Pro pour lever les limitations.', { 
      current, 
      max, 
      percentage: Math.round(percentage) 
    })
  }

  return (
    <Card className={`border-l-4 ${isMaxed ? 'border-l-red-500 bg-red-50' : 'border-l-orange-500 bg-orange-50'} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {getTitle()}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {getMessage()}
            </p>
            
            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isMaxed ? 'bg-red-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Badge variant={isMaxed ? "destructive" : "secondary"} className="text-xs">
                {current}/{max === Infinity ? '∞' : max}
              </Badge>
              
              <Button 
                size="sm" 
                onClick={handleUpgrade}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Crown className="h-4 w-4 mr-1" />
                {t('limits.upgrade', 'Passer au Pro')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Composant pour afficher un modal de limitation
 */
export function PlanLimitModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  onUpgrade 
}) {
  const { t } = useTranslation()
  const router = useRouter()

  if (!isOpen) return null

  const handleUpgrade = () => {
    onClose()
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push('/dashboard/subscription')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title || t('limits.modal.title', 'Limite atteinte')}
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            {message || t('limits.modal.defaultMessage', 'Vous avez atteint les limites de votre plan gratuit.')}
          </p>

          <div className="flex space-x-3 ">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 text-black"
            >
              {t('common.close', 'Fermer')}
            </Button>
            <Button 
              onClick={handleUpgrade}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Crown className="h-4 w-4 mr-1" />
              {t('limits.upgrade', 'Passer au Pro')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanLimitAlert
