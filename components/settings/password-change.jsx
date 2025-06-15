'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'

export default function PasswordChange({ onBack }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError(t('settings.items.allFieldsRequired') || 'Tous les champs sont requis')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('settings.items.passwordMismatch') || 'Les mots de passe ne correspondent pas')
      return
    }

    if (formData.newPassword.length < 6) {
      setError(t('settings.items.passwordTooShort') || 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        }),
      })

      if (response.ok) {
        setSuccess(t('settings.items.passwordChanged') || 'Mot de passe modifié avec succès')
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // Retourner aux paramètres après 2 secondes
        setTimeout(() => {
          onBack()
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || t('settings.items.passwordChangeError') || 'Erreur lors du changement de mot de passe')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setError(t('settings.items.passwordChangeError') || 'Erreur lors du changement de mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back') || 'Retour'}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="h-8 w-8 text-blue-600" />
            {t('settings.items.changePassword')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('settings.items.changePasswordDesc') || 'Modifiez votre mot de passe pour sécuriser votre compte'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Old Password */}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.items.oldPassword')}
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.items.newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.items.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading 
                  ? (t('common.loading') || 'Chargement...') 
                  : t('settings.items.changePassword')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
