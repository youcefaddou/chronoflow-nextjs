'use client'

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import { 
	emitTaskUpdate, 
	emitTimerStart, 
	emitTimerStop, 
	emitTimerPause, 
	emitTimerResume,
	emitTimerSync 
} from '../../hooks/use-task-synchronization'

const GlobalTimerContext = createContext()

export function useGlobalTimer() {
	const context = useContext(GlobalTimerContext)
	if (!context) {
		throw new Error('useGlobalTimer must be used within GlobalTimerProvider')
	}
	return context
}

export default function GlobalTimerProvider({ children, onTaskUpdate }) {
	const [accumulated, setAccumulated] = useState(0) // total seconds before current session
	const [running, setRunning] = useState(false)
	const [paused, setPaused] = useState(false)
	const [task, setTask] = useState(null)
	const [startTimestamp, setStartTimestamp] = useState(null) // ms since epoch
	const intervalRef = useRef(null)
	const [onSave, setOnSave] = useState(null) // callback pour notifier la sauvegarde

	// Tick for UI update
	const [, setTick] = useState(0)
	useEffect(() => {
		if (running && !paused) {
			if (!intervalRef.current) {
				intervalRef.current = setInterval(() => setTick(t => t + 1), 1000)
			}
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [running, paused])
	const start = (newTask = null, initialSeconds = 0) => {
		setTask(newTask)
		setAccumulated(initialSeconds)
		setRunning(true)
		setPaused(false)
		setStartTimestamp(Date.now())
		
		// Émettre l'événement de démarrage du timer
		const taskId = newTask?.id || newTask?._id
		if (taskId) {
			emitTimerStart(taskId, newTask)
		}
	}
	const pause = () => {
		if (running && !paused && startTimestamp) {
			const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
			setAccumulated(a => a + elapsed)
			setStartTimestamp(null)
		}
		setPaused(true)
		
		// Émettre l'événement de pause du timer
		const taskId = task?.id || task?._id
		if (taskId) {
			emitTimerPause(taskId, task)
		}
	}
	const resume = () => {
		if (running && paused) {
			setStartTimestamp(Date.now())
			setPaused(false)
			
			// Émettre l'événement de reprise du timer
			const taskId = task?.id || task?._id
			if (taskId) {
				emitTimerResume(taskId, task)
			}
		}
	}
	const stop = useCallback(async () => {
		let total = accumulated
		if (running && startTimestamp) {
			const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
			total += elapsed
		}
		
		const taskId = task?.id || task?._id
		
		// D'abord émettre l'événement d'arrêt pour synchroniser l'UI
		if (taskId) {
			emitTimerStop(taskId, total, task)
		}
		
		if (task && taskId) {
			const isGoogleEvent = !!task.isGoogle || String(taskId).startsWith('gcal-')
			try {				
				if (isGoogleEvent) {
					const eventId = String(taskId).replace(/^gcal-/, '')
					const response = await fetch('/api/integrations/google-calendar/event-times', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ eventId, durationSeconds: total }),
					})
					
					if (!response.ok) {
						console.error('Failed to save Google event timer:', await response.text())
					}
					
					if (typeof onSave === 'function') onSave(eventId, total)
				} else {
					const response = await fetch(`/api/tasks/${taskId}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ durationSeconds: total }),
					})
					
					if (!response.ok) {
						console.error('Failed to save task timer:', await response.text())
					}
					
					if (typeof onSave === 'function') onSave(taskId, total)
				}
				
				// Émettre l'événement de mise à jour de tâche après sauvegarde réussie
				emitTaskUpdate(taskId, total)
				
				// Notifier le dashboard que les tâches doivent être rafraîchies
				if (typeof onTaskUpdate === 'function') {
					onTaskUpdate()
				}
				
				// Synchroniser toutes les vues
				emitTimerSync({
					action: 'stop',
					taskId,
					duration: total,
					task
				})
				
			} catch (err) {
				console.error('GlobalTimerProvider.stop: Failed to save timer', err)
				// Même en cas d'erreur, émettre les événements pour la cohérence UI
				emitTaskUpdate(taskId, total)
			}
		} else {
			console.warn('GlobalTimerProvider.stop: No valid task id or _id, skipping save', task)
		}
		
		// Réinitialiser l'état du timer
		setRunning(false)
		setPaused(false)
		setStartTimestamp(null)
		setTask(null)
		setAccumulated(0)
	}, [accumulated, running, startTimestamp, task, onSave, onTaskUpdate])
	const setTime = s => setAccumulated(s)
	const setOnSaveCallback = cb => setOnSave(() => cb)
	
	// Méthode pour démarrer depuis une durée existante (utile pour les tâches qui ont déjà du temps)
	const startFrom = (initialSeconds, newTask) => {
		start(newTask, initialSeconds)
	}

	const getElapsedSeconds = () => {
		if (!running) return 0
		if (paused || !startTimestamp) return accumulated
		return accumulated + Math.floor((Date.now() - startTimestamp) / 1000)
	}

	return (
		<GlobalTimerContext.Provider
			value={{
				running,
				paused,
				task,
				start,
				startFrom,
				pause,
				resume,
				stop,
				setTime,
				setTask,
				getElapsedSeconds,
				setOnSaveCallback,
			}}
		>
			{children}
		</GlobalTimerContext.Provider>
	)
}
