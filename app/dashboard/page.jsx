'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboardUser } from '../../contexts/dashboard-user-context'
import { useTaskUpdate } from '../../contexts/task-update-context'
import { useGlobalTimer } from '../../components/timer/global-timer-provider'
import { Calendar, List, Focus, Download } from 'lucide-react'
import Timer from '../../components/timer/timer'
import SaveTimerModal from '../../components/timer/save-timer-modal'
import FocusZoneModal from '../../components/dashboard/FocusZoneModal'
import TaskListView from '../../components/tasks/task-list-view'
import CalendarView from '../../components/calendar/calendar-view'
import TaskExporterModal from '../../components/export/task-exporter'

// Pour l'instant, gardons les imports commentés pour éviter les erreurs
// import CalendarSelectorModal from '../../components/dashboard/CalendarSelectorModal'

export default function DashboardPage() {	const { t } = useTranslation()
	const { user, loading: userLoading } = useDashboardUser()
	const { refreshKey: taskRefreshKey, triggerUpdate: triggerTaskUpdate } = useTaskUpdate()
	const {
		running: isRunning,
		paused: isPaused,
		task: currentTask,
		start: startTimer,
		pause: pauseTimer,
		stop: stopTimer,
		getElapsedSeconds
	} = useGlobalTimer()

	// Helper function to format time
	const getFormattedTime = () => {
		const totalSeconds = getElapsedSeconds()
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60
		
		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		}
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	// Helper function to save current time
	const saveCurrentTime = async () => {
		// The timer provider automatically saves when stop() is called
		// So we don't need a separate save function
		return Promise.resolve()
	}	// Fonction pour sauvegarder une nouvelle tâche créée depuis le timer
	const handleSaveTimerTask = async (taskData) => {
		if (!user || !user.id) {
			alert('Utilisateur non authentifié')
			return
		}
		
		console.log('handleSaveTimerTask: Saving task', taskData)
		
		try {
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: taskData.title,
					description: taskData.description || '',
					start: taskData.start,
					end: taskData.end,
					color: taskData.color || '#2563eb',
					durationSeconds: taskData.duration_seconds || 0,
					isFinished: true,
				}),
			})
			
			console.log('handleSaveTimerTask: Response status', res.status)
			
			const data = await res.json()
			if (!res.ok) {
				console.error('handleSaveTimerTask: Error response', data)
				alert('Erreur lors de l\'enregistrement: ' + (data.message || data.error))
				return
			}
			

					// Sauvegarder l'ID et la durée pour auto-démarrage
			setLastSavedTaskId(data.id)
			setLastSavedDuration(taskData.duration_seconds || 0)
			
			setShowSaveTimer(false)
			setElapsedSecondsToSave(0)
			triggerTaskUpdate()		} catch (err) {
			console.error('handleSaveTimerTask: Exception', err)

		}
	}
	
	// Fonction pour importer Google Calendar
	const handleImportGoogleCalendar = async () => {
		try {
			const res = await fetch('/api/integrations/google-calendar/import', {
				method: 'POST',
			})
			if (!res.ok) {
				const data = await res.json()
				alert(data.error || 'Erreur lors de l\'import Google Calendar')
				return
			}
			// Rafraîchir les données
			triggerTaskUpdate()
			alert('Import Google Calendar réussi !')
		} catch (err) {
			console.error('Error importing Google Calendar:', err)
			alert('Erreur lors de l\'import Google Calendar')
		}
	}
		const [activeFilter, setActiveFilter] = useState('all')
	const [viewMode, setViewMode] = useState('calendar') // 'calendar' ou 'list'
	const [showFocusZone, setShowFocusZone] = useState(false)
	const [showCalendarSelector, setShowCalendarSelector] = useState(false)
	const [showSaveTimer, setShowSaveTimer] = useState(false)
	const [elapsedSecondsToSave, setElapsedSecondsToSave] = useState(0)
	const [showExportModal, setShowExportModal] = useState(false)
	const [tasks, setTasks] = useState([])
	const [lastSavedTaskId, setLastSavedTaskId] = useState(null)
	const [lastSavedDuration, setLastSavedDuration] = useState(0)
	// Charger les tâches
	const loadTasks = async () => {
		if (!user?.id) {
			console.log('loadTasks: No user ID, skipping')
			return
		}

		
		try {
			const res = await fetch('/api/tasks', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})
						
			if (res.ok) {
				const data = await res.json()
				setTasks(Array.isArray(data) ? data : [])
			} else {
				const errorText = await res.text()
				console.error('loadTasks: Error response', res.status, errorText)
				setTasks([])
			}
		} catch (err) {
			console.error('loadTasks: Exception', err)
			setTasks([])
		}
	}	// Charger les tâches au chargement et lors du refresh
	useEffect(() => {
		loadTasks()
	}, [user?.id, taskRefreshKey])
	// Écouter les événements de mise à jour des tâches
	useEffect(() => {
		const handleTaskUpdateEvent = () => {
			triggerTaskUpdate()
		}

		window.addEventListener('taskUpdated', handleTaskUpdateEvent)
		return () => window.removeEventListener('taskUpdated', handleTaskUpdateEvent)
	}, [triggerTaskUpdate])

	// Fonction de callback pour rafraîchir les tâches
	const handleTaskUpdate = () => {
		triggerTaskUpdate()
	}
	// Raccourcis clavier - simplifiés car Timer gère ses propres contrôles
	useEffect(() => {
		const handleKeyPress = (e) => {
			// Les raccourcis sont maintenant gérés par le composant Timer
			// On peut garder ceci pour d'autres raccourcis futurs
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [])

	if (userLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-red-600">{t('auth.userNotConnected', 'Utilisateur non connecté')}</p>
			</div>
		)
	}
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header avec timer et contrôles */}
			<div className="bg-white shadow-sm border-b">
				<div className="flex items-center justify-between p-6">					
					{/* Section gauche - Timer moderne */}
					<div className="flex items-center space-x-6">
						<Timer 
							onSaveTimer={(elapsedSeconds) => {
								setElapsedSecondsToSave(elapsedSeconds)
								setShowSaveTimer(true)
							}}
						/>
					</div>

					{/* Section droite - Actions et navigation */}
					<div className="flex items-center space-x-3">
						{/* Boutons de vue */}
						<div className="flex items-center bg-gray-100 rounded-lg p-1">
							<button
								onClick={() => setViewMode('calendar')}
								className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
									viewMode === 'calendar' 
										? 'bg-white text-blue-600 shadow-sm' 
										: 'text-gray-600 hover:text-gray-900'
								}`}
								title={t('dashboard.calendar', 'Calendrier')}
							>
								<Calendar className="w-4 h-4" />
								<span className="text-sm font-medium">{t('dashboard.calendar', 'Calendrier')}</span>
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
									viewMode === 'list' 
										? 'bg-white text-blue-600 shadow-sm' 
										: 'text-gray-600 hover:text-gray-900'
								}`}
								title={t('dashboard.tasks', 'Tâches')}
							>
								<List className="w-4 h-4" />
								<span className="text-sm font-medium">{t('dashboard.tasks', 'Tâches')}</span>
							</button>
						</div>

						{/* Actions rapides */}
						<button
							onClick={() => setShowFocusZone(true)}
							className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
							title={t('dashboard.focusZone', 'Zone de focus')}
						>
							<Focus className="w-4 h-4" />
							<span className="text-sm font-medium">{t('dashboard.focusZone', 'Focus')}</span>
						</button>						<button
							onClick={handleImportGoogleCalendar}
							className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
							title={t('dashboard.importCalendar', 'Importer calendrier')}
						>
							<Calendar className="w-4 h-4" />
							<span className="text-sm font-medium">{t('dashboard.import', 'Importer')}</span>
						</button>

						<button
							onClick={() => setShowExportModal(true)}
							className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
							title={t('dashboard.exportTasks', 'Exporter les tâches')}
						>
							<Download className="w-4 h-4" />
							<span className="text-sm font-medium">{t('dashboard.export', 'Exporter')}</span>
						</button>
					</div>
				</div>
			</div>			
			{/* Zone de contenu principal */}
			<div className="flex-1 p-6">
				{viewMode === 'calendar' ? (
					<CalendarView
						user={user}
						refreshKey={taskRefreshKey}
						lastSavedTaskId={lastSavedTaskId}
						lastSavedDuration={lastSavedDuration}
						onRefresh={handleTaskUpdate}
					/>
				) : (
					<TaskListView
						tasks={tasks}
						onTaskUpdate={handleTaskUpdate}
						user={user}
						lastSavedTaskId={lastSavedTaskId}
						lastSavedDuration={lastSavedDuration}
						refreshKey={taskRefreshKey}
					/>
				)}
			</div>{/* Modales */}
			{showFocusZone && (
				<FocusZoneModal
					seconds={getElapsedSeconds()}
					running={isRunning}
					isPaused={isPaused}
					onStartPause={() => {
						if (!isRunning || isPaused) {
							startTimer(currentTask)
						} else {
							pauseTimer()
						}
					}}
					onStop={() => {
						stopTimer()
					}}
					onClose={() => setShowFocusZone(false)}
				/>
			)}
					{showSaveTimer && (
				<SaveTimerModal
					onClose={() => setShowSaveTimer(false)}
					onSave={handleSaveTimerTask}
					elapsedSeconds={elapsedSecondsToSave}
				/>
			)}

			{showExportModal && (
				<TaskExporterModal
					isOpen={showExportModal}
					onClose={() => setShowExportModal(false)}
					tasks={tasks}
					user={user}
					lang={t('lang', 'fr')}
				/>
			)}
			
			{/* Autres modales (pour l'instant commentées) */}
			{/*
			{showFocusZone && (
				<FocusZoneModal
					onClose={() => setShowFocusZone(false)}
					onTaskSelect={(task) => {
						setShowFocusZone(false)
						startTimer(task)
					}}
				/>
			)}

			{showCalendarSelector && (
				<CalendarSelectorModal
					onClose={() => setShowCalendarSelector(false)}
					user={user}
					onImportComplete={() => setRefreshKey(prev => prev + 1)}
				/>
			)}
			*/}
		</div>
	)
}
