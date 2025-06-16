'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'

export default function IntegrationsPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [googleEmail, setGoogleEmail] = useState(null)

  useEffect(() => {
    // Vérifier le statut de connexion Google Calendar
    checkGoogleStatus()
  }, [])

  useEffect(() => {
    // Vérifier les paramètres d'URL pour les retours d'OAuth
    const googleStatus = searchParams.get('google')
    if (googleStatus === 'success') {
      toast.success('Google Calendar connecté avec succès!')
      checkGoogleStatus() // Rafraîchir le statut
    } else if (googleStatus === 'error') {
      toast.error('Erreur lors de la connexion à Google Calendar')
    }
  }, [searchParams])
  const getAuthToken = () => {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
    }
    return null
  }

  const checkGoogleStatus = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.warn('Token non trouvé')
        return
      }

      const response = await fetch('/api/integrations/google-calendar/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setGoogleConnected(data.connected)
        setGoogleEmail(data.email)
      } else {
        console.warn('Erreur statut:', response.status)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error)
    }
  }

  const connectGoogleCalendar = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Erreur d\'authentification - veuillez vous reconnecter')
        return
      }

      const response = await fetch('/api/integrations/google-calendar/auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        throw new Error('URL d\'authentification non reçue')
      }
    } catch (error) {
      console.error('Erreur connexion Google Calendar:', error)
      toast.error(`Erreur lors de la connexion à Google Calendar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  const disconnectGoogleCalendar = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Erreur d\'authentification - veuillez vous reconnecter')
        return
      }

      const response = await fetch('/api/integrations/google-calendar/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        toast.success('Google Calendar déconnecté avec succès!')
        setGoogleConnected(false)
        setGoogleEmail(null)
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erreur déconnexion Google Calendar:', error)
      toast.error(`Erreur lors de la déconnexion: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const syncGoogleCalendar = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Erreur d\'authentification - veuillez vous reconnecter')
        return
      }

      const response = await fetch('/api/integrations/google-calendar/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(`${data.imported} événements importés avec succès!`)
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erreur sync Google Calendar:', error)
      toast.error(`Erreur lors de la synchronisation: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Intégrations
          </h1>
          <p className="text-gray-600 mt-1">
            Connectez vos services préférés à ChronoFlow
          </p>
        </div>

        <div className="space-y-6">          {/* Google Calendar Integration */}
          <div className={`bg-white rounded-lg shadow p-6 transition-all ${
            googleConnected ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  googleConnected ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Google Calendar</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      googleConnected ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      googleConnected ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {googleConnected ? 'Connecté' : 'Non connecté'}
                    </span>
                  </div>
                </div>
              </div>
              
              {googleConnected && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Actif
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">
              Synchronisez vos événements Google Calendar avec ChronoFlow pour un suivi de temps unifié.
            </p>
              <div className="flex gap-4">
              {!googleConnected ? (
                <button 
                  onClick={connectGoogleCalendar}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    loading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg'
                  }`}
                >
                  {loading ? 'Connexion...' : 'Connecter Google Calendar'}
                </button>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={syncGoogleCalendar}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium border transition-all ${
                      loading 
                        ? 'border-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400'
                    }`}
                  >
                    {loading ? 'Synchronisation...' : 'Synchroniser les événements'}
                  </button>
                  
                  <button 
                    onClick={disconnectGoogleCalendar}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      loading 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg'
                    }`}
                  >
                    {loading ? 'Déconnexion...' : 'Déconnecter Google Calendar'}
                  </button>
                </div>
              )}
            </div>            {googleConnected && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-green-800 font-semibold text-lg">
                      🎉 Google Calendar connecté avec succès !
                    </h3>
                    {googleEmail && (
                      <p className="text-green-700 text-sm mt-1">
                        <strong>Compte connecté :</strong> {googleEmail}
                      </p>
                    )}
                    <p className="text-green-700 text-sm mt-1">
                      Vos événements Google Calendar sont maintenant synchronisés avec ChronoFlow.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
