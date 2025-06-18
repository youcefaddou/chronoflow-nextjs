'use client'

import { useEffect, useCallback } from 'react'
import { useTaskSynchronization } from '../../hooks/use-task-synchronization'


 // Composant de gestion centralisée de la synchronisation des timers
 // Ce composant écoute tous les événements de timer et force la re-render des composants
 
export default function TimerSyncManager({ 
	onTaskUpdate, 
	onTimerStateChange, 
	onForceRefresh 
}) {
	// Callback pour forcer le rafraîchissement de toutes les vues
	const forceGlobalRefresh = useCallback(() => {
		// Force un re-render de tous les composants qui dépendent des données de tâches
		if (typeof onForceRefresh === 'function') {
			onForceRefresh()
		}
		
		// Dispatch un événement global pour les composants qui ne peuvent pas utiliser les props
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('globalRefreshRequested', {
				detail: { timestamp: Date.now() }
			}))
		}
	}, [onForceRefresh])

	// Gérer les événements de synchronisation
	useTaskSynchronization({
		onTaskUpdate: useCallback((taskId, duration) => {
			console.log('[TimerSyncManager] Task updated:', taskId, duration)
			if (typeof onTaskUpdate === 'function') {
				onTaskUpdate(taskId, duration)
			}
			forceGlobalRefresh()
		}, [onTaskUpdate, forceGlobalRefresh]),

		onTimerStart: useCallback((taskId, task) => {
			console.log('[TimerSyncManager] Timer started:', taskId, task?.title)
			if (typeof onTimerStateChange === 'function') {
				onTimerStateChange('start', taskId, task)
			}
			forceGlobalRefresh()
		}, [onTimerStateChange, forceGlobalRefresh]),

		onTimerStop: useCallback((taskId, duration, task) => {
			console.log('[TimerSyncManager] Timer stopped:', taskId, duration, task?.title)
			if (typeof onTimerStateChange === 'function') {
				onTimerStateChange('stop', taskId, task, duration)
			}
			forceGlobalRefresh()
		}, [onTimerStateChange, forceGlobalRefresh]),

		onTimerPause: useCallback((taskId, task) => {
			console.log('[TimerSyncManager] Timer paused:', taskId, task?.title)
			if (typeof onTimerStateChange === 'function') {
				onTimerStateChange('pause', taskId, task)
			}
			forceGlobalRefresh()
		}, [onTimerStateChange, forceGlobalRefresh]),

		onTimerResume: useCallback((taskId, task) => {
			console.log('[TimerSyncManager] Timer resumed:', taskId, task?.title)
			if (typeof onTimerStateChange === 'function') {
				onTimerStateChange('resume', taskId, task)
			}
			forceGlobalRefresh()
		}, [onTimerStateChange, forceGlobalRefresh]),

		onTimerSync: useCallback((data) => {
			console.log('[TimerSyncManager] Timer sync:', data)
			forceGlobalRefresh()
		}, [forceGlobalRefresh])
	})

	return null // Ce composant ne rend rien, il ne fait que gérer les événements
}
