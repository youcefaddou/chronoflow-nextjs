'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Moon, Sun, Bell, BellOff } from 'lucide-react'

export default function UserPreferences() {
  const { t, i18n } = useTranslation()
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    notifications: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    // Charger les préférences depuis le localStorage ou l'API
    const loadPreferences = () => {
      const savedLanguage = i18n.language || 'fr'
      const savedTheme = localStorage.getItem('theme') || 'light'
      const savedNotifications = localStorage.getItem('notifications') !== 'false'
      
      setPreferences({
        language: savedLanguage,
        theme: savedTheme,
        notifications: savedNotifications
      })
    }
    
    loadPreferences()
  }, [i18n.language])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const handleLanguageChange = async (newLanguage) => {
    setIsLoading(true)
    
    try {
      // Changer la langue avec i18n
      await i18n.changeLanguage(newLanguage)
      
      // Sauvegarder dans localStorage
      localStorage.setItem('language', newLanguage)
      
      // Mettre à jour l'état local
      setPreferences(prev => ({ ...prev, language: newLanguage }))
      
      // Optionnel : sauvegarder sur le serveur
      try {
        await fetch('/api/user/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: newLanguage })
        })
      } catch (error) {
        console.log('Could not save language preference to server:', error)
      }
      
      showMessage(
        t('settings.items.languageChanged') || 'Langue modifiée avec succès',
        'success'
      )
    } catch (error) {
      console.error('Error changing language:', error)
      showMessage(
        t('settings.items.languageChangeError') || 'Erreur lors du changement de langue',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (newTheme) => {
    setPreferences(prev => ({ ...prev, theme: newTheme }))
    localStorage.setItem('theme', newTheme)
    
    // Appliquer le thème immédiatement
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    showMessage(
      t('settings.items.themeChanged') || 'Thème modifié avec succès',
      'success'
    )
  }

  const handleNotificationsChange = (enabled) => {
    setPreferences(prev => ({ ...prev, notifications: enabled }))
    localStorage.setItem('notifications', enabled.toString())
    
    // Demander la permission pour les notifications si activées
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showMessage(
            t('settings.items.notificationsEnabled') || 'Notifications activées',
            'success'
          )
        }
      })
    } else {
      showMessage(
        enabled 
          ? (t('settings.items.notificationsEnabled') || 'Notifications activées')
          : (t('settings.items.notificationsDisabled') || 'Notifications désactivées'),
        'success'
      )
    }
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

      {/* Language Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {t('settings.items.language')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('settings.items.languageDesc') || 'Choisissez votre langue préférée pour l\'interface'}
            </p>
            <div className="mt-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('fr')}
                  disabled={isLoading || preferences.language === 'fr'}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    preferences.language === 'fr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  disabled={isLoading || preferences.language === 'en'}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    preferences.language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          {preferences.theme === 'dark' ? (
            <Moon className="h-5 w-5 text-purple-600 mt-0.5" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-600 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {t('settings.items.theme')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('settings.items.themeDesc') || 'Personnalisez l\'apparence de l\'interface'}
            </p>
            <div className="mt-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    preferences.theme === 'light'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  {t('settings.items.lightTheme') || 'Clair'}
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    preferences.theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  {t('settings.items.darkTheme') || 'Sombre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          {preferences.notifications ? (
            <Bell className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {t('settings.items.notifications')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('settings.items.notificationsDesc') || 'Recevez des notifications pour vos tâches et rappels'}
            </p>
            <div className="mt-3">
              <button
                onClick={() => handleNotificationsChange(!preferences.notifications)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  preferences.notifications
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {preferences.notifications ? (
                  <>
                    <Bell className="h-4 w-4" />
                    {t('settings.items.notificationsOn') || 'Activées'}
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4" />
                    {t('settings.items.notificationsOff') || 'Désactivées'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
