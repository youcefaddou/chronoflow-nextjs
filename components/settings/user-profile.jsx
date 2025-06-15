'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Mail, Calendar, Clock, Edit2, Save, X } from 'lucide-react'

export default function UserProfile() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    createdAt: '',
    lastSignInAt: ''
  })
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        setProfile({
          username: userData.username || '',
          email: userData.email || '',
          createdAt: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : '',
          lastSignInAt: userData.lastSignInAt
            ? new Date(userData.lastSignInAt).toLocaleDateString()
            : ''
        })
      } else {
        showMessage(
          t('settings.items.profileLoadError') || 'Erreur lors du chargement du profil',
          'error'
        )
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      showMessage(
        t('settings.items.profileLoadError') || 'Erreur lors du chargement du profil',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUsername = () => {
    setIsEditingUsername(true)
    setNewUsername(profile.username)
  }

  const handleCancelEdit = () => {
    setIsEditingUsername(false)
    setNewUsername('')
  }

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      showMessage(
        t('settings.items.usernameRequired') || 'Le nom d\'utilisateur est requis',
        'error'
      )
      return
    }

    if (newUsername === profile.username) {
      setIsEditingUsername(false)
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername.trim() })
      })

      if (response.ok) {
        setProfile(prev => ({ ...prev, username: newUsername.trim() }))
        setIsEditingUsername(false)
        showMessage(
          t('settings.items.usernameUpdated') || 'Nom d\'utilisateur mis à jour avec succès',
          'success'
        )
      } else {
        const data = await response.json()
        showMessage(
          data.message || t('settings.items.usernameUpdateError') || 'Erreur lors de la mise à jour',
          'error'
        )
      }
    } catch (error) {
      console.error('Error updating username:', error)
      showMessage(
        t('settings.items.usernameUpdateError') || 'Erreur lors de la mise à jour',
        'error'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`rounded-md p-3 ${
          messageType === 'success' ? 'bg-green-50 border border-green-200' :
          messageType === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm ${
            messageType === 'success' ? 'text-green-700' :
            messageType === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {message}
          </p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('settings.userProfile')}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t('settings.items.name')}
                </label>
                {isEditingUsername ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveUsername()}
                    />
                    <button
                      onClick={handleSaveUsername}
                      disabled={isSaving}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-900">{profile.username || '-'}</span>
                    <button
                      onClick={handleEditUsername}
                      className="p-1 text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t('settings.items.email')}
              </label>
              <div className="mt-1">
                <span className="text-gray-900">{profile.email || '-'}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({t('settings.items.emailNotEditable') || 'Non modifiable'})
                </span>
              </div>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t('settings.items.createdAt')}
              </label>
              <div className="mt-1 text-gray-900">
                {profile.createdAt || '-'}
              </div>
            </div>
          </div>

          {/* Last Sign In */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t('settings.items.lastSignInAt')}
              </label>
              <div className="mt-1 text-gray-900">
                {profile.lastSignInAt || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
