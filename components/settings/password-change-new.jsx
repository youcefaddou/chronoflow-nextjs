'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Eye, EyeOff, Lock, ExternalLink } from 'lucide-react'

export default function PasswordChange({ onBack }) {
  const { t } = useTranslation()
  const [authType, setAuthType] = useState(null)
  const [isLoadingAuthType, setIsLoadingAuthType] = useState(true)
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

  // Récupérer le type d'authentification de l'utilisateur
  useEffect(() => {
    const fetchAuthType = async () => {
      try {
        const response = await fetch('/api/user/auth-type')
        if (response.ok) {
          const data = await response.json()
          setAuthType(data)
        } else {
          setError('Erreur lors de la vérification du type de compte')
        }
      } catch (error) {
        console.error('Error fetching auth type:', error)
        setError('Erreur lors de la vérification du type de compte')
      } finally {
        setIsLoadingAuthType(false)
      }
    }

    fetchAuthType()
  }, [])

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
        setError(data.error || t('settings.items.passwordChangeError') || 'Erreur lors du changement de mot de passe')
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
            {t('settings.items.changePassword') || 'Changer le mot de passe'}
          </h1>
        </div>

        {/* Chargement du type d'authentification */}
        {isLoadingAuthType ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Vérification...</span>
          </div>
        ) : authType && !authType.canChangePassword ? (
          /* Utilisateur connecté via Google */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Compte connecté via Google
              </h2>
              <p className="text-gray-600 mb-6">
                Votre compte est connecté via Google. Votre mot de passe est géré directement par Google.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Pour modifier votre mot de passe, rendez-vous sur votre compte Google :
                </p>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Gérer mon compte Google
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Formulaire de changement de mot de passe pour utilisateurs classiques */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password */}
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.items.oldPassword') || 'Ancien mot de passe'}
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
                  {t('settings.items.newPassword') || 'Nouveau mot de passe'}
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
                  {t('settings.items.confirmPassword') || 'Confirmer le mot de passe'}
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
                    : (t('settings.items.changePassword') || 'Changer le mot de passe')
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
