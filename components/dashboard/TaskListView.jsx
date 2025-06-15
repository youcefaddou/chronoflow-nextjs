'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalTimer } from '../timer/global-timer-provider'
import CalendarEventTimerButton from './CalendarEventTimerButton'
import AddTaskModal from './AddTaskModal'

function TaskListView({ tasks = [], onTaskUpdate, user, lastSavedTaskId, lastSavedDuration }) {
	const { t } = useTranslation()
	const timer = useGlobalTimer()
	const [selectedTask, setSelectedTask] = useState(null)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showAddModal, setShowAddModal] = useState(false)

	const formatDuration = (seconds) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	const formatDate = (date) => {
		if (!date) return ''
		const d = new Date(date)
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	const handleEditTask = (task) => {
		setSelectedTask(task)
		setShowEditModal(true)
	}

	const handleEditTaskSave = async (taskData) => {
		if (!selectedTask) return
		
		if (String(selectedTask.id).startsWith('gcal-')) {
			// Google event update
			const googleId = String(selectedTask.id).replace(/^gcal-/, '')
			try {
				const res = await fetch(`/api/integrations/google-calendar/event-times/${googleId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: taskData.title,
						description: taskData.desc || '',
						start: taskData.start,
						end: taskData.end,
					}),
				})
				if (res.ok) {
					onTaskUpdate?.()
					setShowEditModal(false)
					setSelectedTask(null)
				}
			} catch (err) {
				console.error('Error updating Google event:', err)
			}
			return
		}

		try {
			const res = await fetch(`/api/tasks/${selectedTask.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: taskData.title,
					description: taskData.desc || '',
					start: taskData.start,
					end: taskData.end,
					color: taskData.color || '#2563eb',
				}),
			})
			if (res.ok) {
				onTaskUpdate?.()
				setShowEditModal(false)
				setSelectedTask(null)
			}
		} catch (error) {
			console.error('Error updating task:', error)
		}
	}

	const handleEditTaskDelete = async () => {
		if (!selectedTask) return
		
		if (String(selectedTask.id).startsWith('gcal-')) {
			// Delete Google event locally
			const pureId = String(selectedTask.id).replace(/^gcal-/, '')
			try {
				await fetch(`/api/integrations/google-calendar/event-times/${pureId}`, {
					method: 'DELETE',
				})
				onTaskUpdate?.()
				setShowEditModal(false)
				setSelectedTask(null)
			} catch (error) {
				console.error('Error deleting Google event:', error)
			}
			return
		}

		try {
			await fetch(`/api/tasks/${selectedTask.id}`, {
				method: 'DELETE',
			})
			onTaskUpdate?.()
			setShowEditModal(false)
			setSelectedTask(null)
		} catch (error) {
			console.error('Error deleting task:', error)
		}
	}

	const handleAddTaskSave = async (taskData) => {
		try {
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: taskData.title,
					description: taskData.desc || '',
					start: taskData.start,
					end: taskData.end,
					color: taskData.color || '#2563eb',
					durationSeconds: taskData.duration_seconds || 0,
					isFinished: false,
				}),
			})
			if (res.ok) {
				onTaskUpdate?.()
				setShowAddModal(false)
			}
		} catch (error) {
			console.error('Error creating task:', error)
		}
	}

	const handleTaskFinish = async (task) => {
		let elapsed = 0
		if (timer.running && timer.task?.id === task.id && timer.getElapsedSeconds) {
			elapsed = timer.getElapsedSeconds()
			timer.stop()
		}
		const newDuration = (task.durationSeconds || 0) + elapsed

		if (String(task.id).startsWith('gcal-')) {
			const googleId = String(task.id).replace(/^gcal-/, '')
			try {
				const res = await fetch(`/api/integrations/google-calendar/event-times/${googleId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						durationSeconds: newDuration,
						isFinished: true,
					}),
				})
				if (res.ok) {
					onTaskUpdate?.()
				}
			} catch (err) {
				console.error('Error completing Google event:', err)
			}
			return
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
			if (res.ok) {
				onTaskUpdate?.()
			}
		} catch (err) {
			console.error('Error completing task:', err)
		}
	}

	return (
		<div className='h-full p-4'>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-2xl font-bold text-gray-900'>
					{t('tasks.title') || 'Task List'}
				</h2>
				<button
					onClick={() => setShowAddModal(true)}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
				>
					{t('tasks.addTask') || 'Add Task'}
				</button>
			</div>

			{lastSavedTaskId && (
				<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
					<p className='text-sm text-green-700'>
						{t('tasks.lastSaved') || 'Last saved task:'} {lastSavedTaskId}
						{lastSavedDuration > 0 && ` (${formatDuration(lastSavedDuration)})`}
					</p>
				</div>
			)}

			<div className='space-y-3'>
				{tasks.length === 0 ? (
					<div className='text-center py-12'>
						<div className='text-gray-400 text-lg mb-2'>📝</div>
						<p className='text-gray-600'>{t('tasks.noTasks') || 'No tasks found'}</p>
						<p className='text-gray-500 text-sm mt-1'>
							{t('tasks.createFirst') || 'Create your first task to get started'}
						</p>
					</div>
				) : (
					tasks.map(task => (
						<div
							key={task.id}
							className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
								task.isFinished || task.is_finished ? 'opacity-60 bg-gray-50' : ''
							}`}
						>
							<div className='flex items-center justify-between'>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-3'>
										<div
											className='w-4 h-4 rounded-full flex-shrink-0'
											style={{ backgroundColor: task.color || '#2563eb' }}
										/>
										<div className='flex-1 min-w-0'>
											<h3 className={`font-semibold text-gray-900 truncate ${
												task.isFinished || task.is_finished ? 'line-through' : ''
											}`}>
												{task.title}
											</h3>
											<div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
												<span>{formatDate(task.start)}</span>
												{task.isGoogle && (
													<span className='px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs'>
														Google
													</span>
												)}
												{task.durationSeconds > 0 && (
													<span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs'>
														{formatDuration(task.durationSeconds)}
													</span>
												)}
											</div>
											{task.description && (
												<p className='text-gray-600 text-sm mt-1 truncate'>
													{task.description}
												</p>
											)}
										</div>
									</div>
								</div>
								<div className='flex items-center gap-2 ml-4'>
									<CalendarEventTimerButton
										event={task}
										timer={timer}
										disabled={task.isFinished || task.is_finished}
										onTaskUpdate={onTaskUpdate}
										onFinish={() => handleTaskFinish(task)}
									/>
									<button
										onClick={() => handleEditTask(task)}
										className='px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded'
									>
										{t('common.edit') || 'Edit'}
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			<AddTaskModal
				open={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSave={handleAddTaskSave}
			/>

			<AddTaskModal
				open={showEditModal}
				initialStart={selectedTask?.start}
				initialEnd={selectedTask?.end}
				initialTitle={selectedTask?.title}
				initialDesc={selectedTask?.description}
				initialColor={selectedTask?.color}
				showDelete
				onClose={() => {
					setShowEditModal(false)
					setSelectedTask(null)
				}}
				onSave={handleEditTaskSave}
				onDelete={handleEditTaskDelete}
			/>
		</div>
	)
}

export default TaskListView
