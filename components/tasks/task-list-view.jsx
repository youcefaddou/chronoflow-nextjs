'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalTimer } from '../timer/global-timer-provider'
import { useTaskSynchronization } from '../../hooks/use-task-synchronization'
import CalendarEventTimerButton from './calendar-event-timer-button'
import AddTaskModal from '../dashboard/AddTaskModal'

function formatDuration(seconds) {
	if (!seconds || isNaN(seconds)) return '00:00:00'
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = seconds % 60
	return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

function mapTaskFromApi(task) {
	if (!task) return task
	return {
		id: task.id || task._id,
		title: task.title,
		description: task.description,
		start: typeof task.start === 'string' || task.start instanceof Date ? task.start : (task.start ? new Date(task.start) : null),
		end: typeof task.end === 'string' || task.end instanceof Date ? task.end : (task.end ? new Date(task.end) : null),
		color: task.color || '#2563eb',
		userId: task.userId,
		isFinished: typeof task.isFinished === 'boolean' ? task.isFinished : (task.is_finished ?? false),
		is_finished: typeof task.is_finished === 'boolean' ? task.is_finished : (task.isFinished ?? false),
		durationSeconds: typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0),
		// Ajoute tous les autres champs éventuels
		...task,
	}
}

function TaskListView({ tasks = [], onTaskUpdate, user, lastSavedTaskId, lastSavedDuration, refreshKey }) {
	const timer = useGlobalTimer()
	const { t, i18n } = useTranslation()
	const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
	const [, setTick] = useState(0)
	const [editTask, setEditTask] = useState(null)
	const [localTaskDurations, setLocalTaskDurations] = useState({})
	const [showAddTaskModal, setShowAddTaskModal] = useState(false)
	const [taskList, setTaskList] = useState(tasks.map(mapTaskFromApi))
	const [statusMessage, setStatusMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	// Keep local taskList in sync with tasks prop
	useEffect(() => {
		setTaskList(tasks.map(mapTaskFromApi))
	}, [tasks])

	useEffect(() => {
		if (!timer.running) return
		const interval = setInterval(() => setTick(t => t + 1), 1000)
		return () => clearInterval(interval)
	}, [timer.running])

	// Écouter les événements de mise à jour des tâches pour synchronisation
	useEffect(() => {
		const handleTaskUpdate = (event) => {
			const { taskId, duration } = event.detail || {}
			if (taskId) {
				// Mettre à jour la durée locale de la tâche
				setTaskList(prevTasks => 
					prevTasks.map(task => 
						String(task.id) === String(taskId) || String(task.id).replace(/^gcal-/, '') === String(taskId)
							? { ...task, durationSeconds: duration }
							: task
					)
				)
				// Déclencher un refresh global
				if (onTaskUpdate) {
					onTaskUpdate()
				}
			}
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('taskUpdated', handleTaskUpdate)
			return () => window.removeEventListener('taskUpdated', handleTaskUpdate)
		}
	}, [onTaskUpdate])

	// handleFinish (marquer comme terminé)
	const handleFinish = async (task) => {
		let elapsed = 0
		if (timer.running && timer.task?.id === task.id && timer.getElapsedSeconds) {
			elapsed = timer.getElapsedSeconds()
			timer.stop()
		}
		const newDuration = (task.durationSeconds || 0) + elapsed
		
		if (String(task.id).startsWith('gcal-')) {
			// Mise à jour du temps Google + marquer comme terminé
			const eventId = String(task.id).replace(/^gcal-/, '')
			try {
				const res = await fetch(`/api/integrations/google-calendar/event-times/${eventId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						durationSeconds: newDuration,
						isFinished: true,
					}),
				})
						if (!res.ok) {
					const text = await res.text()
					// Silent error handling for production
					setErrorMessage(lang === 'fr' ? '❌ Erreur lors de la complétion Google' : '❌ Error finishing Google event')
					setTimeout(() => setErrorMessage(''), 3000)
					return
				}
				setStatusMessage(lang === 'fr' ? '✅ Tâche Google terminée' : '✅ Google task completed')
				setTimeout(() => setStatusMessage(''), 3000)
				onTaskUpdate && onTaskUpdate()
				return
			} catch (err) {
				// Silent error handling for production
				setErrorMessage(lang === 'fr' ? '❌ Erreur lors de la complétion Google' : '❌ Error finishing Google event')
				setTimeout(() => setErrorMessage(''), 3000)
				return
			}
		}
		
		try {
			const res = await fetch(`/api/tasks/${task.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					durationSeconds: newDuration,
					isFinished: true,
				}),
			})
			
			if (!res.ok) {
				const text = await res.text()
				// Silent error handling for production
			}
			onTaskUpdate && onTaskUpdate()
		} catch (err) {
			// Silent error handling for production
		}
	}

	const handleTaskClick = (task, e) => {
		const target = e.target
		if (
			target?.closest('.task-timer-buttons') ||
			target?.dataset?.timerButton === 'true' ||
			target?.parentElement?.dataset?.timerButton === 'true'
		) {
			return
		}
		setEditTask(task)
	}

	const handleEditSave = async (updatedTask) => {
		const id = editTask?.id || editTask?._id
		if (!id) {
			// Silent error handling for production
			setEditTask(null)
			return
		}
		
		if (String(id).startsWith('gcal-')) {
			// Edition locale Google
			const eventId = String(id).replace(/^gcal-/, '')
			try {
				await fetch(`/api/integrations/google-calendar/event-times/${eventId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: updatedTask.title,
						description: updatedTask.description || '',
						start: updatedTask.start,
						end: updatedTask.end,
						color: updatedTask.color || '#2563eb',
					}),
				})
				setEditTask(null)
				onTaskUpdate && onTaskUpdate()
				return
			} catch (err) {
				// Silent error handling for production
				setEditTask(null)
				return
			}
		}
		
		try {
			const res = await fetch(`/api/tasks/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: updatedTask.title,
					description: updatedTask.description || '',
					start: updatedTask.start,
					end: updatedTask.end,
					color: updatedTask.color || '#2563eb',
				}),
			})
			setEditTask(null)
			if (onTaskUpdate) onTaskUpdate()
		} catch (err) {
			// Silent error handling for production
			setEditTask(null)
		}
	}

	const handleEditClose = () => setEditTask(null)
	const handleAddTaskOpen = () => setShowAddTaskModal(true)
	const handleAddTaskClose = () => setShowAddTaskModal(false)
		const handleAddTaskSave = async (newTask) => {
		try {
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: newTask.title,
					description: newTask.description || '',
					start: newTask.start,
					end: newTask.end,
					color: newTask.color || '#2563eb',
					durationSeconds: 0,
					isFinished: false,
				}),
			})		
			if (!res.ok) {
				const text = await res.text()
				// Silent error handling for production
				alert(lang === 'fr'
					? `Erreur lors de l'ajout de la tâche: ${text.slice(0, 200)}`
					: `Error adding task: ${text.slice(0, 200)}`)
				return
			}
			
			const data = await res.json()
			onTaskUpdate && onTaskUpdate()
			setShowAddTaskModal(false)
		} catch (err) {
			// Silent error handling for production
			alert(lang === 'fr'
				? `Erreur lors de l'ajout de la tâche: ${err.message}`
				: `Error adding task: ${err.message}`)
		}
	}
	const handleTaskTimerUpdate = (taskId, newDuration) => {
		setLocalTaskDurations(prev => ({
			...prev,
			[taskId]: newDuration
		}))
		onTaskUpdate && onTaskUpdate()
	}

	const safeUser = user || {}

	const getTaskDuration = (task) => {
		if (typeof task.durationSeconds === 'number') {
			return task.durationSeconds
		}
		return 0
	}

	// Démarrage automatique du timer sur la tâche nouvellement créée (depuis SaveTimerModal)
	useEffect(() => {
		if (lastSavedTaskId && lastSavedDuration && taskList.length > 0) {
			const justCreated = taskList.find(t => t.id === lastSavedTaskId)
			if (justCreated && (!timer.running || timer.task?.id !== lastSavedTaskId)) {
				if (typeof timer.startFrom === 'function') {
					timer.startFrom(lastSavedDuration, justCreated)
				} else if (typeof timer.start === 'function') {
					timer.start(justCreated, lastSavedDuration)
				}
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastSavedTaskId, lastSavedDuration, taskList])
	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			{/* Messages de statut et d'erreur */}
			{statusMessage && (
				<div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
					<p className="text-green-700 text-sm">{statusMessage}</p>
				</div>
			)}
			{errorMessage && (
				<div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
					<p className="text-red-700 text-sm">{errorMessage}</p>
				</div>
			)}
			
			{/* En-tête avec bouton d'ajout */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-blue-700">
					{t('tasks.taskList') || (lang === 'fr' ? 'Liste des tâches' : 'Task List')}
				</h2>
				<div className="flex gap-2">
					{/* Bouton Ajouter une tâche */}
					<button
						onClick={handleAddTaskOpen}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center gap-2 transition-colors"
						aria-label={lang === 'fr' ? 'Ajouter une tâche' : 'Add task'}
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						</svg>
						<span className="hidden sm:inline">
							{t('tasks.addTask') || (lang === 'fr' ? 'Ajouter une tâche' : 'Add task')}
						</span>
					</button>
				</div>
			</div>

			<div className="divide-y divide-gray-100">
				{taskList.length === 0 ? (
					<div className="py-8 text-center text-gray-400 text-lg">
						{t('tasks.noTasks') || (lang === 'fr'
							? 'Aucune tâche à afficher.'
							: 'No tasks to display.')}
					</div>
				) : (
					taskList.map(task => {
						const isRunning = timer.running && timer.task?.id === task.id
						const elapsed = isRunning && timer.getElapsedSeconds ? timer.getElapsedSeconds() : 0
						const taskDuration = getTaskDuration(task)
						const totalSeconds = isRunning ? elapsed : taskDuration

						return (
							<div
								key={task.id || task._id}
								className="flex items-center gap-3 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
								onClick={(e) => handleTaskClick(task, e)}
								role="button"
								tabIndex={0}
								style={{ position: 'relative' }}
							> 
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-gray-900 truncate">
										{task.title || task.summary || '(Google event)'}
									</h3>
									{task.description && (
										<p className="text-sm text-gray-500 truncate mt-1">
											{task.description}
										</p>
									)}
								</div>
								
								{task.isGoogle && (
									<span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
										Google
									</span>
								)}
								
								<div className="flex items-center gap-3">
									<span className="font-mono text-lg text-blue-700 min-w-[80px] text-center">
										{formatDuration(totalSeconds)}
									</span>
									
									<div className="task-timer-buttons">
										<CalendarEventTimerButton 
											event={{ ...task, id: String(task.id) }} 
											timer={timer} 
											lang={lang}
											disabled={task.is_finished} 
											onTaskUpdate={onTaskUpdate}
										/>
									</div>
									
									<button
										onClick={e => { e.stopPropagation(); handleFinish(task) }}
										className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer disabled:cursor-not-allowed transition-colors ${
											task.is_finished
												? 'bg-green-100 text-green-700'
												: 'bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-700'
										}`}
									>
										{task.is_finished
											? (lang === 'fr' ? 'Terminé' : 'Completed')
											: (lang === 'fr' ? 'Terminer' : 'Finish')}
									</button>
								</div>
							</div>
						)
					})
				)}
			</div>
					{/* Modale d'édition avec suppression */}
			{editTask && (
				<AddTaskModal
					open={!!editTask}
					editTask={editTask}
					showDelete={true}
					onClose={handleEditClose}
					onSave={handleEditSave}
					onDelete={async () => {
						if (!editTask || !(editTask.id || editTask._id)) {
							setEditTask(null)
							onTaskUpdate && onTaskUpdate()
							return
						}
						
						const id = editTask.id || editTask._id
						if (String(id).startsWith('gcal-')) {
							// Suppression locale Google
							const eventId = String(id).replace(/^gcal-/, '')
							try {
								await fetch(`/api/integrations/google-calendar/event-times/${eventId}`, {
									method: 'DELETE',
								})
								setEditTask(null)
								onTaskUpdate && onTaskUpdate()
								return
							} catch (err) {
								// Silent error handling for production
								setEditTask(null)
								return
							}
						}
						
						try {
							const res = await fetch(`/api/tasks/${id}`, {
								method: 'DELETE',
							})
							if (!res.ok) {
								const text = await res.text()
								// Silent error handling for production
							}
						} catch (err) {
							// Silent error handling for production
						}
						setEditTask(null)
						if (onTaskUpdate) onTaskUpdate()
					}}
				/>
			)}
			
			{/* Nouvelle modale d'ajout */}
			{showAddTaskModal && (
				<AddTaskModal
					open={showAddTaskModal}
					onClose={handleAddTaskClose}
					onSave={handleAddTaskSave}
				/>
			)}
		</div>
	)
}

export default TaskListView
