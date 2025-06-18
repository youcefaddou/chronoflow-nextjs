'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { AlertTriangle, X } from 'lucide-react'

function CancelSubscriptionModal({ isOpen, onClose, subscriptionData, onSuccess }) {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(t('subscription.cancel.success'))
        onSuccess(data)
        onClose()
      } else {
        toast.error(data.error || t('subscription.cancel.error'))
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      toast.error(t('subscription.cancel.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('subscription.cancel.warning')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            {t('subscription.cancel.title')}
          </h4>
          
          <p className="text-gray-600 mb-4">
            {t('subscription.cancel.description')}
          </p>

          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              {t('subscription.cancel.consequence1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              {t('subscription.cancel.consequence2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              {t('subscription.cancel.consequence3')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-1">•</span>
              {t('subscription.cancel.consequence4')}
            </li>
          </ul>

          {subscriptionData?.current_period_end && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {t('subscription.cancel.confirmDescription', {
                  endDate: formatDate(new Date(subscriptionData.current_period_end * 1000))
                })}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading}
          >
            {t('subscription.cancel.goBack')}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('subscription.cancel.processing') : t('subscription.cancel.confirm')}
          </button>
        </div>

        {/* Support link */}
        <div className="mt-4 text-center">
          <a
            href="mailto:contact.chronoflow@gmail.com"
            className="text-sm text-blue-600 hover:underline"
          >
            {t('subscription.cancel.support')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CancelSubscription({ subscriptionData, onCancellationSuccess }) {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  // Ne pas afficher le bouton si pas d'abonnement actif
  if (!subscriptionData || subscriptionData.status !== 'active' || subscriptionData.cancel_at_period_end) {
    return null
  }

  return (
    <>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-900 mb-2">
          {t('subscription.cancel.title')}
        </h3>
        <p className="text-red-700 text-sm mb-4">
          {t('subscription.cancellationInfo')}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          {t('subscription.cancel.button')}
        </button>
      </div>

      <CancelSubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        subscriptionData={subscriptionData}
        onSuccess={onCancellationSuccess}
      />
    </>
  )
}
