'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
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
            {t('integrations.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('integrations.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Google Calendar Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                Google Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Synchronisez vos événements Google Calendar avec ChronoFlow pour un suivi de temps unifié.
              </p>
                <div className="flex gap-4">
                <Button 
                  onClick={connectGoogleCalendar}
                  disabled={loading}
                  variant={googleConnected ? "outline" : "default"}
                >
                  {loading ? 'Connexion...' : googleConnected ? 'Reconnecter' : 'Connecter Google Calendar'}
                </Button>
                
                {googleConnected && (
                  <>
                    <Button 
                      onClick={syncGoogleCalendar}
                      disabled={loading}
                      variant="outline"
                    >
                      {loading ? 'Synchronisation...' : 'Synchroniser les événements'}
                    </Button>
                    
                    <Button 
                      onClick={disconnectGoogleCalendar}
                      disabled={loading}
                      variant="destructive"
                    >
                      {loading ? 'Déconnexion...' : 'Déconnecter'}
                    </Button>
                  </>
                )}
              </div>

              {googleConnected && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">
                      Google Calendar connecté
                    </span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    {googleEmail && `Connecté avec : ${googleEmail}`}
                  </p>
                  <p className="text-green-600 text-sm">
                    Vos événements Google Calendar apparaîtront dans votre calendrier ChronoFlow.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Autres intégrations futures */}
          <Card>
            <CardHeader>
              <CardTitle>Intégrations à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    <span className="font-medium text-gray-500">Slack</span>
                  </div>
                  <p className="text-sm text-gray-400">Prochainement disponible</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    <span className="font-medium text-gray-500">Trello</span>
                  </div>
                  <p className="text-sm text-gray-400">Prochainement disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
