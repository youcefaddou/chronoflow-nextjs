import { useState, useEffect, useCallback } from 'react'

/**
 * Hook pour forcer le re-render des composants quand les timers changent
 * Utilise un compteur de rafraîchissement pour déclencher les re-renders
 */
export function useTimerRefresh() {
	const [refreshKey, setRefreshKey] = useState(0)

	const forceRefresh = useCallback(() => {
		setRefreshKey(prev => prev + 1)
	}, [])

	// Écouter les événements de rafraîchissement global
	useEffect(() => {
		const handleGlobalRefresh = () => {
			forceRefresh()
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('globalRefreshRequested', handleGlobalRefresh)
			window.addEventListener('taskUpdated', handleGlobalRefresh)
			window.addEventListener('timerStopped', handleGlobalRefresh)
			window.addEventListener('timerStarted', handleGlobalRefresh)

			return () => {
				window.removeEventListener('globalRefreshRequested', handleGlobalRefresh)
				window.removeEventListener('taskUpdated', handleGlobalRefresh)
				window.removeEventListener('timerStopped', handleGlobalRefresh)
				window.removeEventListener('timerStarted', handleGlobalRefresh)
			}
		}
	}, [forceRefresh])

	return {
		refreshKey,
		forceRefresh
	}
}

/**
 * Hook pour gérer les mises à jour de données en temps réel
 * Maintient une liste des tâches/événements et les met à jour automatiquement
 */
export function useRealtimeData(initialData = [], fetchData = null) {
	const [data, setData] = useState(initialData)
	const [loading, setLoading] = useState(false)
	const { refreshKey } = useTimerRefresh()

	// Fonction pour mettre à jour une tâche spécifique
	const updateTaskInData = useCallback((taskId, updates) => {
		setData(prevData => {
			return prevData.map(item => {
				const itemId = String(item.id || item._id || '').replace(/^gcal-/, '')
				const targetId = String(taskId).replace(/^gcal-/, '')
				
				if (itemId === targetId) {
					return { ...item, ...updates }
				}
				return item
			})
		})
	}, [])

	// Recharger les données quand le refresh key change
	useEffect(() => {
		if (typeof fetchData === 'function' && refreshKey > 0) {
			setLoading(true)
			fetchData()
				.then(newData => {
					if (Array.isArray(newData)) {
						setData(newData)
					}
				})
				.catch(error => {
					console.error('Error fetching realtime data:', error)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [refreshKey, fetchData])

	// Écouter les mises à jour de tâches individuelles
	useEffect(() => {
		const handleTaskUpdate = (event) => {
			const { taskId, duration } = event.detail || {}
			if (taskId) {
				updateTaskInData(taskId, { durationSeconds: duration })
			}
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('taskUpdated', handleTaskUpdate)
			return () => window.removeEventListener('taskUpdated', handleTaskUpdate)
		}
	}, [updateTaskInData])

	return {
		data,
		setData,
		loading,
		updateTaskInData,
		refreshKey
	}
}
