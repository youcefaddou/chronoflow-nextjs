import { useEffect, useCallback } from 'react'

/**
 * Hook pour écouter les événements de synchronisation des tâches et timers
 * Permet aux composants de réagir automatiquement aux mises à jour des timers
 */
export function useTaskSynchronization(callbacks = {}) {
	const {
		onTaskUpdate,
		onTimerStart,
		onTimerStop,
		onTimerPause,
		onTimerResume,
		onTimerSync
	} = callbacks

	const handleTaskUpdate = useCallback((event) => {
		const { taskId, duration } = event.detail || {}
		if (taskId && typeof onTaskUpdate === 'function') {
			onTaskUpdate(taskId, duration)
		}
	}, [onTaskUpdate])

	const handleTimerStart = useCallback((event) => {
		const { taskId, task } = event.detail || {}
		if (typeof onTimerStart === 'function') {
			onTimerStart(taskId, task)
		}
	}, [onTimerStart])

	const handleTimerStop = useCallback((event) => {
		const { taskId, duration, task } = event.detail || {}
		if (typeof onTimerStop === 'function') {
			onTimerStop(taskId, duration, task)
		}
	}, [onTimerStop])

	const handleTimerPause = useCallback((event) => {
		const { taskId, task } = event.detail || {}
		if (typeof onTimerPause === 'function') {
			onTimerPause(taskId, task)
		}
	}, [onTimerPause])

	const handleTimerResume = useCallback((event) => {
		const { taskId, task } = event.detail || {}
		if (typeof onTimerResume === 'function') {
			onTimerResume(taskId, task)
		}
	}, [onTimerResume])

	const handleTimerSync = useCallback((event) => {
		if (typeof onTimerSync === 'function') {
			onTimerSync(event.detail)
		}
	}, [onTimerSync])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const events = [
				['taskUpdated', handleTaskUpdate],
				['timerStarted', handleTimerStart],
				['timerStopped', handleTimerStop],
				['timerPaused', handleTimerPause],
				['timerResumed', handleTimerResume],
				['timerSync', handleTimerSync]
			]

			events.forEach(([eventName, handler]) => {
				window.addEventListener(eventName, handler)
			})

			return () => {
				events.forEach(([eventName, handler]) => {
					window.removeEventListener(eventName, handler)
				})
			}
		}
	}, [handleTaskUpdate, handleTimerStart, handleTimerStop, handleTimerPause, handleTimerResume, handleTimerSync])
}

/**
 * Fonctions utilitaires pour émettre les événements de synchronisation
 */

// Mise à jour d'une tâche (durée sauvegardée)
export function emitTaskUpdate(taskId, duration) {
	if (typeof window !== 'undefined') {
		console.log('[Sync] Task updated:', taskId, duration)
		window.dispatchEvent(new CustomEvent('taskUpdated', { 
			detail: { taskId, duration } 
		}))
	}
}

// Démarrage du timer
export function emitTimerStart(taskId, task) {
	if (typeof window !== 'undefined') {
		console.log('[Sync] Timer started:', taskId, task?.title)
		window.dispatchEvent(new CustomEvent('timerStarted', { 
			detail: { taskId, task } 
		}))
	}
}

// Arrêt du timer
export function emitTimerStop(taskId, duration, task) {
	if (typeof window !== 'undefined') {
		console.log('[Sync] Timer stopped:', taskId, duration, task?.title)
		window.dispatchEvent(new CustomEvent('timerStopped', { 
			detail: { taskId, duration, task } 
		}))
	}
}

// Pause du timer
export function emitTimerPause(taskId, task) {
	if (typeof window !== 'undefined') {
		console.log('[Sync] Timer paused:', taskId, task?.title)
		window.dispatchEvent(new CustomEvent('timerPaused', { 
			detail: { taskId, task } 
		}))
	}
}

// Reprise du timer
export function emitTimerResume(taskId, task) {
	if (typeof window !== 'undefined') {
		console.log('[Sync] Timer resumed:', taskId, task?.title)
		window.dispatchEvent(new CustomEvent('timerResumed', { 
			detail: { taskId, task } 
		}))
	}
}

// Synchronisation générale des timers
export function emitTimerSync(data) {
	if (typeof window !== 'undefined') {
		console.log('[Sync] Timer sync:', data)
		window.dispatchEvent(new CustomEvent('timerSync', { 
			detail: data 
		}))
	}
}

/**
 * Hook simplifié pour la rétrocompatibilité
 */
export function useTaskUpdate(onTaskUpdate) {
	return useTaskSynchronization({ onTaskUpdate })
}
