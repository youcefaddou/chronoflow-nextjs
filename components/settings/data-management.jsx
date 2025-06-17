'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Trash2, AlertTriangle } from 'lucide-react'
import TaskExporterModal from '../export/task-exporter'

export default function DataManagement() {
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [tasks, setTasks] = useState([])
  const [user, setUser] = useState(null)
  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }

  // Charger les données utilisateur et les tâches pour l'export
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Charger les informations utilisateur
        const userRes = await fetch('/api/user/profile')
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
        }

        // Charger les tâches
        const tasksRes = await fetch('/api/tasks')
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    loadUserData()
  }, [])

  const handleExportData = () => {
    // Ouvrir la modale d'export au lieu de télécharger directement en JSON
    setShowExportModal(true)
  }  
  const handleDeleteData = async () => {
    const expectedText = t('lang') === 'en' ? 'DELETE' : 'SUPPRIMER'
    if (deleteConfirmText !== expectedText) {
      showMessage(
        t('settings.items.deleteConfirmError') || 'Veuillez taper "SUPPRIMER" pour confirmer',
        'error'
      )
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/user/delete-data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        showMessage(
          t('settings.items.deleteSuccess') || 'Données supprimées avec succès',
          'success'
        )

        // Nettoyage des cookies et localStorage
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        localStorage.clear()
        sessionStorage.clear()

        // Redirection vers la page d'accueil après suppression
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        throw new Error(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting data:', error)
      showMessage(
        t('settings.items.deleteError') || 'Erreur lors de la suppression des données',
        'error'
      )
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`rounded-md p-3 ${messageType === 'success' ? 'bg-green-50 border border-green-200' :
            messageType === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
          }`}>
          <p className={`text-sm ${messageType === 'success' ? 'text-green-700' :
              messageType === 'error' ? 'text-red-700' :
                'text-blue-700'
            }`}>
            {message}
          </p>
        </div>
      )}

      {/* Export Data */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <Download className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {t('settings.items.exportData')}
            </h3>            <p className="text-sm text-gray-600 mt-1">
              {t('settings.items.exportDataDesc') || 'Exportez toutes vos données personnelles (tâches, temps de travail, paramètres) dans le format de votre choix : CSV, PDF ou rapport de productivité.'}
            </p><button
              onClick={handleExportData}
              disabled={isExporting}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {t('settings.items.exportData')}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Data */}
      <div className="bg-white rounded-lg border border-red-200 p-4">
        <div className="flex items-start gap-3">
          <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {t('settings.items.deleteAccount') || 'Supprimer le compte'}
            </h3>            <p className="text-sm text-gray-600 mt-1">
              {t('settings.items.deleteAccountDesc') || 'Supprimez définitivement votre compte et toutes vos données (tâches, temps enregistrés, intégrations, historique de connexion). Cette action est irréversible et vous déconnectera automatiquement.'}
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                {t('settings.items.deleteAccount') || 'Supprimer le compte'}
              </button>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-900">
                      {t('settings.items.deleteWarning') || 'Attention'}
                    </span>
                  </div>                  <p className="text-sm text-red-700">
                    {t('settings.items.deleteWarningText') || 'Cette action supprimera définitivement votre compte et toutes vos données : tâches, temps enregistrés, intégrations Google Calendar, historique de connexion. Vous serez déconnecté automatiquement. Tapez "SUPPRIMER" pour confirmer.'}
                  </p>
                </div>

                <div>                  <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={t('settings.items.deletePlaceholder') || 'Tapez SUPPRIMER'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                </div>

                <div className="flex gap-2">                  <button
                    onClick={handleDeleteData}
                    disabled={isDeleting || deleteConfirmText !== (t('lang') === 'en' ? 'DELETE' : 'SUPPRIMER')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >{isDeleting
                    ? (t('settings.items.deleting') || 'Suppression en cours...')
                    : (t('settings.items.confirmDeleteAccount') || 'Confirmer la suppression du compte')
                    }
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmText('')
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                  >
                    {t('common.cancel') || 'Annuler'}
                  </button>
                </div>
              </div>
            )}          </div>
        </div>
      </div>

      {/* Modale d'export */}
      {showExportModal && (
        <TaskExporterModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          tasks={tasks}
          user={user}
          lang={t('lang', 'fr')}
        />
      )}
    </div>
  )
}
