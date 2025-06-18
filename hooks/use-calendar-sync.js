import { useEffect, useState, useCallback } from 'react'
import { useTaskSynchronization } from './use-task-synchronization'
import { useTimerRefresh } from './use-timer-refresh'


 // Hook spécialisé pour les vues du calendrier
 // Gère la synchronisation des événements et des timers

export function useCalendarSync(events = [], onEventsUpdate = null) {
	const [syncedEvents, setSyncedEvents] = useState(events)
	const { refreshKey, forceRefresh } = useTimerRefresh()

	// Mettre à jour les événements quand les props changent
	useEffect(() => {
		setSyncedEvents(events)
	}, [events])

	// Fonction pour mettre à jour un événement spécifique
	const updateEvent = useCallback((eventId, updates) => {
		setSyncedEvents(prevEvents => {
			const newEvents = prevEvents.map(event => {
				const normalizedEventId = String(event.id || event._id || '').replace(/^gcal-/, '')
				const normalizedTargetId = String(eventId).replace(/^gcal-/, '')
				
				if (normalizedEventId === normalizedTargetId) {
					return { ...event, ...updates }
				}
				return event
			})
			
			// Notifier le parent si nécessaire
			if (typeof onEventsUpdate === 'function') {
				onEventsUpdate(newEvents)
			}
			
			return newEvents
		})
	}, [onEventsUpdate])
	// Écouter les événements de synchronisation
	useTaskSynchronization({
		onTaskUpdate: useCallback((taskId, duration) => {
			console.log('[CalendarSync] Updating event duration:', taskId, duration)
			updateEvent(taskId, { durationSeconds: duration })
		}, [updateEvent]),

		onTimerStart: useCallback((taskId) => {
			console.log('[CalendarSync] Timer started for event:', taskId)
			// Peut être utilisé pour mettre à jour l'état visuel
			forceRefresh()
		}, [forceRefresh]),

		onTimerStop: useCallback((taskId, duration) => {
			console.log('[CalendarSync] Timer stopped for event:', taskId, duration)
			updateEvent(taskId, { durationSeconds: duration })
		}, [updateEvent]),

		onTimerPause: useCallback((taskId) => {
			console.log('[CalendarSync] Timer paused for event:', taskId)
			forceRefresh()
		}, [forceRefresh]),

		onTimerResume: useCallback((taskId) => {
			console.log('[CalendarSync] Timer resumed for event:', taskId)
			forceRefresh()
		}, [forceRefresh])
	})

	return {
		events: syncedEvents,
		updateEvent,
		refreshKey,
		forceRefresh
	}
}

/**
 * Hook pour les listes de tâches
 */
export function useTaskListSync(tasks = [], onTasksUpdate = null) {
	const [syncedTasks, setSyncedTasks] = useState(tasks)
	const { refreshKey, forceRefresh } = useTimerRefresh()

	// Mettre à jour les tâches quand les props changent
	useEffect(() => {
		setSyncedTasks(tasks)
	}, [tasks])

	// Fonction pour mettre à jour une tâche spécifique
	const updateTask = useCallback((taskId, updates) => {
		setSyncedTasks(prevTasks => {
			const newTasks = prevTasks.map(task => {
				const normalizedTaskId = String(task.id || task._id || '').replace(/^gcal-/, '')
				const normalizedTargetId = String(taskId).replace(/^gcal-/, '')
				
				if (normalizedTaskId === normalizedTargetId) {
					return { ...task, ...updates }
				}
				return task
			})
			
			// Notifier le parent si nécessaire
			if (typeof onTasksUpdate === 'function') {
				onTasksUpdate(newTasks)
			}
			
			return newTasks
		})
	}, [onTasksUpdate])
	// Écouter les événements de synchronisation
	useTaskSynchronization({
		onTaskUpdate: useCallback((taskId, duration) => {
			console.log('[TaskListSync] Updating task duration:', taskId, duration)
			updateTask(taskId, { durationSeconds: duration })
		}, [updateTask]),

		onTimerStop: useCallback((taskId, duration) => {
			console.log('[TaskListSync] Timer stopped for task:', taskId, duration)
			updateTask(taskId, { durationSeconds: duration })
		}, [updateTask])
	})

	return {
		tasks: syncedTasks,
		updateTask,
		refreshKey,
		forceRefresh
	}
}
