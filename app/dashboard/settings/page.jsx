'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Plug, 
  HelpCircle, 
  Trash2,
  CheckCircle, 
  Calendar, 
  AlertCircle 
} from 'lucide-react'

// Import des composants
import UserProfile from '../../../components/settings/user-profile'
import UserPreferences from '../../../components/settings/user-preferences'
import PasswordChange from '../../../components/settings/password-change'
import ConnectedDevices from '../../../components/settings/connected-devices'
import LoginHistory from '../../../components/settings/login-history'
import SupportSection from '../../../components/settings/support-section'
import DataManagement from '../../../components/settings/data-management'

export default function SettingsPage() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  // Google Calendar integration state
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)  
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Vérifier l'état de la connexion Google Calendar au chargement
  useEffect(() => {
    checkConnectionStatus()
    
    // Vérifier si on revient d'un callback Google
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const googleStatus = urlParams.get('google')
    
    if (code && state === 'google-calendar-auth') {
      handleGoogleCallback(code)
    } else if (googleStatus === 'success') {
      setError('')
      setSuccess(t('settings.items.googleCalendarConnected'))
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname)
      // Recharger le statut
      checkConnectionStatus()
    } else if (googleStatus === 'error') {
      setError(t('settings.items.googleCalendarError'))
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [t])

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integrations/google-calendar/status')
      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.connected)
        setUserEmail(data.email || '')
      } else {
        // Fallback vers localStorage si API non disponible
        const googleTokens = localStorage.getItem('google_calendar_tokens')
        const userEmail = localStorage.getItem('google_user_email')
        
        if (googleTokens && userEmail) {
          setIsConnected(true)
          setUserEmail(userEmail)
        } else {
          setIsConnected(false)
          setUserEmail('')
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error)
      // Fallback vers localStorage en cas d'erreur
      const googleTokens = localStorage.getItem('google_calendar_tokens')
      const userEmail = localStorage.getItem('google_user_email')
      
      if (googleTokens && userEmail) {
        setIsConnected(true)
        setUserEmail(userEmail)
      } else {
        setIsConnected(false)
        setUserEmail('')
      }
    }
  }
  const handleGoogleCallback = async (code) => {
    setIsConnecting(true)
    setError('')
    
    try {
      const response = await fetch('/api/integrations/google-calendar/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Stocker les tokens dans localStorage (simulation)
        localStorage.setItem('google_calendar_tokens', JSON.stringify(data.tokens))
        localStorage.setItem('google_user_email', data.email)
        
        setIsConnected(true)
        setUserEmail(data.email)
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname)
        
        setSuccess(t('settings.items.googleCalendarConnected'))
      } else {
        throw new Error('Failed to complete authentication')
      }
    } catch (error) {
      console.error('Error completing Google authentication:', error)
      setError(t('settings.items.googleCalendarError'))
    } finally {
      setIsConnecting(false)
    }
  }

  const handleGoogleConnect = async () => {
    setIsConnecting(true)
    setError('')
    
    try {
      const response = await fetch('/api/integrations/google-calendar/auth')
      if (response.ok) {
        const data = await response.json()
        // Rediriger vers l'URL d'authentification Google
        window.location.href = data.authUrl
      } else {
        throw new Error('Failed to get auth URL')
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
      setError(t('settings.items.googleCalendarError'))
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/integrations/google-calendar/disconnect', {
        method: 'POST'
      })
      
      if (response.ok) {
        // Supprimer également du localStorage
        localStorage.removeItem('google_calendar_tokens')
        localStorage.removeItem('google_user_email')
        
        setIsConnected(false)
        setUserEmail('')
        
        setSuccess(t('settings.items.googleCalendarDisconnected'))
      } else {
        throw new Error('Disconnect API failed')
      }
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error)
      
      // Fallback: supprimer du localStorage même si l'API échoue
      localStorage.removeItem('google_calendar_tokens')
      localStorage.removeItem('google_user_email')
      setIsConnected(false)
      setUserEmail('')
      
      setError(t('settings.items.googleCalendarError'))
    }
  }

  // Définition des sections
  const sections = [
    {
      id: 'profile',
      title: t('settings.userProfile'),
      icon: <User className="h-5 w-5" />,
      component: <UserProfile />
    },
    {
      id: 'preferences',
      title: t('settings.preferences'),
      icon: <SettingsIcon className="h-5 w-5" />,
      component: <UserPreferences />
    },
    {
      id: 'security',
      title: t('settings.security'),
      icon: <Shield className="h-5 w-5" />,
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              {t('settings.items.changePassword')}
            </h3>
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('settings.items.changePassword')}
            </button>
          </div>
          <ConnectedDevices />
          <LoginHistory />
        </div>
      )
    },
    {
      id: 'integrations',
      title: t('settings.integrations'),
      icon: <Plug className="h-5 w-5" />,
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {t('googleCalendar.title')}
            </h3>
            <p className="text-gray-600 mt-1">
              {t('googleCalendar.description')}
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t('googleCalendar.connected')}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {t('common.notConnected') || 'Non connecté'}
                    </span>
                  </>
                )}
              </div>
              {userEmail && (
                <span className="text-sm text-gray-600">({userEmail})</span>
              )}
            </div>

            {/* Connection Actions */}
            <div className="flex gap-3">
              {!isConnected ? (
                <button 
                  onClick={handleGoogleConnect}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting 
                    ? t('googleCalendar.connecting')
                    : t('googleCalendar.connect')
                  }
                </button>
              ) : (
                <button 
                  onClick={handleDisconnect}
                  className="px-4 py-2 border border-red-200 text-red-700 rounded-md hover:bg-red-50"
                >
                  {t('settings.items.disconnectGoogleCalendar')}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      title: t('settings.support'),
      icon: <HelpCircle className="h-5 w-5" />,
      component: <SupportSection />
    },
    {
      id: 'data',
      title: t('settings.others'),
      icon: <Trash2 className="h-5 w-5" />,
      component: <DataManagement />
    }
  ]

  // Si on affiche le changement de mot de passe
  if (showPasswordChange) {
    return <PasswordChange onBack={() => setShowPasswordChange(false)} />
  }  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            {t('settings.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('settings.subtitle') || 'Gérez vos préférences et paramètres de compte'}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {sections.find(s => s.id === activeSection)?.component}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
