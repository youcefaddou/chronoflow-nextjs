'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboardUser } from '../../contexts/dashboard-user-context'
import { useTaskUpdate } from '../../contexts/task-update-context'
import { useGlobalTimer } from '../../components/timer/global-timer-provider'
import { Calendar, List, Focus, Download, CloudDownload } from 'lucide-react'
import Timer from '../../components/timer/timer'
import SaveTimerModal from '../../components/timer/save-timer-modal'
import FocusZoneModal from '../../components/dashboard/FocusZoneModal'
import TaskLimitProgressBar from '../../components/dashboard/TaskLimitProgressBar'
import TaskListView from '../../components/tasks/task-list-view'
import CalendarView from '../../components/calendar/calendar-view'
import TaskExporterModal from '../../components/export/task-exporter'
import { useMergedEvents } from '../../hooks/use-merged-events'

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
			
			const data = await res.json()
			if (!res.ok) {
				console.error('handleSaveTimerTask: Error response', data)
				// On pourrait ajouter un état d'erreur ici si nécessaire
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
	
	// Fonction pour importer Google Calendar avec feedback amélioré
	const [importLoading, setImportLoading] = useState(false)
	const [importStats, setImportStats] = useState(null)
	const [importMessage, setImportMessage] = useState('')
	const [importError, setImportError] = useState('')
	const [timerMessage, setTimerMessage] = useState('')
	const [isHydrated, setIsHydrated] = useState(false)
	
	// Gérer l'hydratation pour éviter les erreurs de mismatch
	useEffect(() => {
		setIsHydrated(true)
	}, [])
	
	const handleImportGoogleCalendar = async () => {
		setImportLoading(true)
		setImportStats(null)
		setImportMessage('')
		setImportError('')
		
		try {
			const res = await fetch('/api/integrations/google-calendar/import', {
				method: 'POST',
			})
			
			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error || 'Erreur lors de l\'import Google Calendar')
			}
			
			const data = await res.json()
			setImportStats(data)			// Rafraîchir les données
			triggerTaskUpdate()
			loadGoogleTasksCount()
			refetchMergedEvents() // Rafraîchir les événements fusionnés
			
			// Rafraîchir les événements dans le calendrier sans refresh de page
			if (eventsRefetchFn) {
				eventsRefetchFn()
			}
			
			// Message de succès avec statistiques
			setImportMessage(` Import réussi ! ${data.imported} nouvelles tâches importées (${data.total} événements scannés)`)
			
			// Effacer le message après 5 secondes
			setTimeout(() => setImportMessage(''), 5000)
			
		} catch (err) {
			console.error('Error importing Google Calendar:', err)
			setImportError(err.message)
			
			// Effacer l'erreur après 5 secondes
			setTimeout(() => setImportError(''), 5000)
		} finally {
			setImportLoading(false)
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
	const [lastSavedDuration, setLastSavedDuration] = useState(0)	// État pour les statistiques des tâches Google
	const [googleTasksCount, setGoogleTasksCount] = useState(0)
	const [eventsRefetchFn, setEventsRefetchFn] = useState(null)
	
	// Hook pour fusionner les tâches normales et Google dans la vue liste
	const { events: mergedEvents, loading: mergedEventsLoading, refetch: refetchMergedEvents } = useMergedEvents()
	
	// Fonction callback pour recevoir la fonction refetch depuis FullCalendarGrid
	const handleEventsRefetch = useCallback((refetchFn) => {
		setEventsRefetchFn(() => refetchFn)
	}, [])
	
	// Charger le nombre de tâches Google importées
	const loadGoogleTasksCount = async () => {
		try {
			const res = await fetch('/api/integrations/google-calendar/imported-events')
			if (res.ok) {
				const data = await res.json()
				setGoogleTasksCount(data.length)
			}
		} catch (err) {
			console.error('Error loading Google tasks count:', err)
		}
	}

	// Charger les tâches
	const loadTasks = async () => {
		if (!user?.id) {
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
	}	// Charger le count au chargement et lors du refresh des tâches
	useEffect(() => {
		if (user?.id) {
			loadGoogleTasksCount()
		}
	}, [user?.id, taskRefreshKey])
	// Charger les tâches au chargement et lors du refresh
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
		refetchMergedEvents() // Rafraîchir aussi les événements fusionnés
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
	if (userLoading || !isHydrated) {
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
	}	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			{/* Header avec timer et contrôles - Responsive */}
			<div className="bg-white shadow-sm border-b">
				{/* Messages d'import */}
				{timerMessage && (
					<div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4">
						<p className="text-blue-700 font-medium text-sm sm:text-base">{timerMessage}</p>
					</div>
				)}
				{importMessage && (
					<div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4">
						<p className="text-green-700 font-medium text-sm sm:text-base">{importMessage}</p>
					</div>
				)}
				{importError && (
					<div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4">
						<p className="text-red-700 font-medium text-sm sm:text-base">{importError}</p>
					</div>
				)}
						<div className="p-3 sm:p-4 lg:p-6">
					{/* Layout responsive - Flexbox adaptatif */}
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						{/* Section Timer - Toujours visible en premier */}
						<div className="flex items-center justify-center lg:justify-start flex-shrink-0">
							<Timer 
								onSaveTimer={(elapsedSeconds) => {
									setElapsedSecondsToSave(elapsedSeconds)
									setShowSaveTimer(true)
								}}
							/>
						</div>						
						{/* Section Actions - Layout adaptatif */}
						<div className="flex flex-col gap-3 lg:gap-2 min-w-0 flex-1 lg:flex-initial">
							{/* Container des actions - Empilage intelligent */}
							<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
								{/* Google Tasks status - Placement adaptatif */}
								{googleTasksCount > 0 && (
									<div className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg order-first sm:order-none">
										<div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
										<span className="text-sm text-green-700 font-medium truncate">
											{googleTasksCount} tâches Google Calendar
										</span>
									</div>
								)}
								
								{/* Actions principales - Grid adaptatif */}
								<div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-row gap-2 flex-1 sm:flex-initial">
									<button
										onClick={() => setShowFocusZone(true)}
										className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium min-w-0"
										title={t('dashboard.focusZone', 'Zone de focus')}
									>
										<Focus className="w-4 h-4 flex-shrink-0" />
										<span className="truncate">{t('dashboard.focusZone', 'Focus')}</span>
									</button>

									<button
										onClick={handleImportGoogleCalendar}
										disabled={importLoading}
										className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all font-medium text-sm min-w-0 ${
											importLoading 
												? 'bg-gray-400 text-white cursor-not-allowed' 
												: 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 shadow-lg'
										}`}
										title={t('dashboard.importCalendar', 'Importer Google Calendar')}
									>
										{importLoading ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
										) : (
											<CloudDownload className="w-4 h-4 flex-shrink-0" />
										)}
										<span className="truncate">
											{importLoading ? 'Import...' : t('dashboard.import', 'Importer')}
										</span>
										{importStats && (
											<span className="hidden lg:inline bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-xs font-semibold ml-1 flex-shrink-0">
												+{importStats.imported}
											</span>
										)}
									</button>

									<button
										onClick={() => setShowExportModal(true)}
										className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium min-w-0"
										title={t('dashboard.exportTasks', 'Exporter les tâches')}
									>
										<Download className="w-4 h-4 flex-shrink-0" />
										<span className="truncate">{t('dashboard.export', 'Exporter')}</span>
									</button>
								</div>
							</div>
						</div>					</div>
				</div>
			</div>			
			{/* Titre principal avec barre de progression */}
			<div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
							{viewMode === 'calendar' ? t('dashboard.calendar', 'Calendrier') : t('dashboard.tasks', 'Tâches')}
						</h1>
						<TaskLimitProgressBar />
					</div>
					
					{/* Boutons de vue - Déplacés ici pour une meilleure UX */}
					<div className="flex items-center bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setViewMode('calendar')}
							className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md transition-colors ${
								viewMode === 'calendar' 
									? 'bg-white text-blue-600 shadow-sm' 
									: 'text-gray-600 hover:text-gray-900'
							}`}
							title={t('dashboard.calendar', 'Calendrier')}
						>
							<Calendar className="w-4 h-4" />
							<span className="hidden sm:inline text-sm font-medium">{t('dashboard.calendar', 'Calendrier')}</span>
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md transition-colors ${
								viewMode === 'list' 
									? 'bg-white text-blue-600 shadow-sm' 
									: 'text-gray-600 hover:text-gray-900'
							}`}
							title={t('dashboard.tasks', 'Tâches')}
						>
							<List className="w-4 h-4" />
							<span className="hidden sm:inline text-sm font-medium">{t('dashboard.tasks', 'Tâches')}</span>
						</button>
					</div>
				</div>
			</div>
			
			{/* Zone de contenu principal - Responsive */}
			<div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-hidden">
				<div className="h-full">
					{viewMode === 'calendar' ? (
						<CalendarView
							user={user}
							refreshKey={taskRefreshKey}
							lastSavedTaskId={lastSavedTaskId}
							lastSavedDuration={lastSavedDuration}
							onRefresh={handleTaskUpdate}
							onEventsRefetch={handleEventsRefetch}
						/>
					) : (
						<TaskListView
							tasks={mergedEvents} // Utiliser les événements fusionnés au lieu des tâches simples
							onTaskUpdate={handleTaskUpdate}
							user={user}
							lastSavedTaskId={lastSavedTaskId}
							lastSavedDuration={lastSavedDuration}
							refreshKey={taskRefreshKey}
						/>
					)}
				</div>
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
			)}			{showExportModal && (
				<TaskExporterModal
					isOpen={showExportModal}
					onClose={() => setShowExportModal(false)}
					tasks={mergedEvents} // Utiliser les événements fusionnés au lieu des tâches simples
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
