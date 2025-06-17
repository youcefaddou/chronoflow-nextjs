'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useTaskUpdate } from './task-update-context'

// Actions du timer
const TIMER_ACTIONS = {
	START: 'START',
	PAUSE: 'PAUSE',
	STOP: 'STOP',
	TICK: 'TICK',
	SET_TASK: 'SET_TASK',
	RESET: 'RESET',
	LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE'
}

// État initial du timer
const initialState = {
	isRunning: false,
	seconds: 0,
	currentTask: null,
	startTime: null,
	pausedAt: null
}

// Reducer pour gérer l'état du timer
function timerReducer(state, action) {
	switch (action.type) {
		case TIMER_ACTIONS.START:
			return {
				...state,
				isRunning: true,
				startTime: action.payload.startTime || Date.now(),
				pausedAt: null
			}
		
		case TIMER_ACTIONS.PAUSE:
			return {
				...state,
				isRunning: false,
				pausedAt: Date.now()
			}
		
		case TIMER_ACTIONS.STOP:
			return {
				...state,
				isRunning: false,
				seconds: 0,
				currentTask: null,
				startTime: null,
				pausedAt: null
			}
		
		case TIMER_ACTIONS.TICK:
			if (!state.isRunning) return state
			return {
				...state,
				seconds: action.payload.seconds
			}
		
		case TIMER_ACTIONS.SET_TASK:
			return {
				...state,
				currentTask: action.payload.task,
				seconds: action.payload.seconds || 0
			}
		
		case TIMER_ACTIONS.RESET:
			return initialState
		
		case TIMER_ACTIONS.LOAD_FROM_STORAGE:
			return {
				...state,
				...action.payload
			}
		
		default:
			return state
	}
}

// Contexte du timer
const GlobalTimerContext = createContext()

// Hook pour utiliser le contexte du timer
export function useGlobalTimer() {
	const context = useContext(GlobalTimerContext)
	if (!context) {
		throw new Error('useGlobalTimer must be used within a GlobalTimerProvider')
	}
	return context
}

// Provider du timer global
export function GlobalTimerProvider({ children }) {
	const [state, dispatch] = useReducer(timerReducer, initialState)
	const taskUpdate = useTaskUpdate()

	// Persister l'état dans localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedState = localStorage.getItem('globalTimer')
			if (savedState) {
				try {
					const parsed = JSON.parse(savedState)
					dispatch({
						type: TIMER_ACTIONS.LOAD_FROM_STORAGE,
						payload: parsed
					})
				} catch (error) {
					console.error('Erreur lors du chargement du timer:', error)
				}
			}
		}
	}, [])

	// Sauvegarder l'état dans localStorage à chaque changement
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('globalTimer', JSON.stringify(state))
		}
	}, [state])

	// Timer tick - mise à jour chaque seconde
	useEffect(() => {
		let interval = null
		
		if (state.isRunning && state.startTime) {
			interval = setInterval(() => {
				const now = Date.now()
				const elapsed = Math.floor((now - state.startTime) / 1000)
				
				dispatch({
					type: TIMER_ACTIONS.TICK,
					payload: { seconds: elapsed }
				})
			}, 1000)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [state.isRunning, state.startTime])

	// Actions du timer
	const startTimer = (task = null) => {
		const startTime = state.pausedAt ? 
			Date.now() - (state.seconds * 1000) : 
			Date.now()

		dispatch({
			type: TIMER_ACTIONS.START,
			payload: { startTime }
		})

		if (task) {
			dispatch({
				type: TIMER_ACTIONS.SET_TASK,
				payload: { task }
			})
		}
	}

	const pauseTimer = () => {
		dispatch({ type: TIMER_ACTIONS.PAUSE })
	}	
	const stopTimer = (shouldShowSaveModal = false) => {
		// If shouldShowSaveModal is true, the caller will handle the save modal
		// Otherwise, just stop the timer normally
		if (!shouldShowSaveModal) {
			dispatch({ type: TIMER_ACTIONS.STOP })
		}
		
		// Déclencher la mise à jour des tâches après l'arrêt du timer
		if (taskUpdate?.triggerUpdate) {
			setTimeout(() => {
				taskUpdate.triggerUpdate()
			}, 100) // Petit délai pour s'assurer que la sauvegarde est terminée
		}
		
		return {
			elapsedSeconds: state.seconds,
			hasTask: !!state.currentTask
		}
	}

	const setCurrentTask = (task, seconds = 0) => {
		dispatch({
			type: TIMER_ACTIONS.SET_TASK,
			payload: { task, seconds }
		})
	}

	const resetTimer = () => {
		dispatch({ type: TIMER_ACTIONS.RESET })
	}

	// Formatage du temps
	const formatTime = (totalSeconds) => {
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		}
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const value = {
		...state,
		startTimer,
		pauseTimer,
		stopTimer,
		setCurrentTask,
		resetTimer,
		formatTime,
		formattedTime: formatTime(state.seconds)
	}

	return (
		<GlobalTimerContext.Provider value={value}>
			{children}
		</GlobalTimerContext.Provider>
	)
}
