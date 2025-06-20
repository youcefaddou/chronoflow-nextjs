import { useState, useEffect, useCallback } from 'react'

/**
 * Hook pour fusionner les tâches internes et les événements Google Calendar avec leur temps suivi
 * Retourne : { events, loading, error, refetch }
 */
export function useMergedEvents() {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Fonction pour mettre à jour un événement localement sans refetch complet
	const updateEventLocally = useCallback((taskId, newDuration) => {
		setEvents(prevEvents => 
			prevEvents.map(event => {
				// Vérifier si c'est l'événement à mettre à jour
				const isMatch = String(event.id) === String(taskId) || 
					String(event.id).replace(/^gcal-/, '') === String(taskId) ||
					String(event.eventId) === String(taskId)
				
				if (isMatch) {
					return { ...event, durationSeconds: newDuration }
				}
				return event
			})
		)
	}, [])

	// Écouter les événements de synchronisation
	useEffect(() => {
		const handleTaskUpdate = (event) => {
			const { taskId, duration } = event.detail || {}
			if (taskId && typeof duration === 'number') {
				updateEventLocally(taskId, duration)
			}
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('taskUpdated', handleTaskUpdate)
			return () => window.removeEventListener('taskUpdated', handleTaskUpdate)
		}
	}, [updateEventLocally])

	const fetchMergedEvents = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const [tasksRes, googleRes] = await Promise.all([
				fetch('/api/tasks'),
				fetch('/api/integrations/google-calendar/imported-events'),
			])

			let merged = []

			if (tasksRes.ok) {
				const data = await tasksRes.json()
				merged = data
			}

			if (googleRes.ok) {
				const googleEvents = await googleRes.json()
				const mappedGoogle = googleEvents.map(event => ({
					...event,
					isGoogle: true,
					id: 'gcal-' + event.eventId, // id unique string pour React
					eventId: event.eventId, // id Google pur pour la DB/API
					title: event.title || event.summary || '(Google event)',
					start: event.start,
					end: event.end,
					durationSeconds: event.durationSeconds || 0,
					is_finished: !!event.isFinished,
					isFinished: !!event.isFinished,
				}))
				merged = [...merged, ...mappedGoogle]
			}

			setEvents(merged)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchMergedEvents()
	}, [fetchMergedEvents])

	return { events, loading, error, refetch: fetchMergedEvents }
}
