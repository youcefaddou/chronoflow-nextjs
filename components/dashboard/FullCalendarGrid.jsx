'use client'

import React, { useState, useMemo, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

import { useTranslation } from 'react-i18next'
import { useGlobalTimer } from '../timer/global-timer-provider'
import { useCalendarSync } from '../../hooks/use-calendar-sync'
import AddTaskModal from './AddTaskModal'
import CalendarEventTimerButton from './CalendarEventTimerButton'
import TaskListView from './TaskListView'
import useMergedEvents from './useMergedEvents'

function FullCalendarGrid({ user, refreshKey, lastSavedTaskId, lastSavedDuration }) {
	const { t } = useTranslation()
	const [selectedEvent, setSelectedEvent] = useState(null)
	const [showAddTaskModal, setShowAddTaskModal] = useState(false)
	const [showEditTaskModal, setShowEditTaskModal] = useState(false)
	const [draftTask, setDraftTask] = useState(null)
	const [errorMessage, setErrorMessage] = useState('')
	const [viewMode, setViewMode] = useState('calendar')
	const timer = useGlobalTimer()

	const { events: mergedEvents, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useMergedEvents(user, refreshKey)
	
	// Utiliser la synchronisation du calendrier
	const { events: syncedEvents, refreshKey: syncRefreshKey } = useCalendarSync(mergedEvents)

	// Error messages with i18n
	const getErrorMessage = useCallback((key) => {
		const messages = {
			fetch: {
				fr: 'Erreur lors du chargement des tâches',
				en: 'Error loading tasks',
			},
			create: {
				fr: 'Erreur lors de la création de la tâche',
				en: 'Error creating task',
			},
			update: {
				fr: 'Erreur lors de la modification de la tâche',
				en: 'Error updating task',
			},
			delete: {
				fr: 'Erreur lors de la suppression de la tâche',
				en: 'Error deleting task',
			},
		}
		return messages[key]?.en || messages[key]?.fr
	}, [])

	// Handle event click (edit)
	const handleEventClick = useCallback((info) => {
		const target = info.jsEvent?.target
		if (
			target?.closest('.task-timer-buttons') ||
			target?.dataset?.timerButton === 'true' ||
			target?.parentElement?.dataset?.timerButton === 'true'
		) {
			return
		}
		setSelectedEvent(info.event)
		setShowEditTaskModal(true)
	}, [])

	// Handle date selection (add)
	const handleDateSelect = useCallback((selectInfo) => {
		setDraftTask({ start: selectInfo.start, end: selectInfo.end })
		setShowAddTaskModal(true)
	}, [])

	// Handle event drop/resize
	const handleEventDrop = useCallback(async (changeInfo) => {
		const { event } = changeInfo
		if (String(event.id).startsWith('gcal-')) {
			// Google event update
			const eventId = String(event.id).replace(/^gcal-/, '')
			try {
				await fetch(`/api/integrations/google-calendar/event-times/${eventId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						start: event.start,
						end: event.end,
					}),
				})
				refetchEvents()
			} catch (err) {
				setErrorMessage('Error updating Google event position')
			}
			return
		}
		try {
			await fetch(`/api/tasks/${event.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					start: event.start,
					end: event.end,
				}),
			})
			refetchEvents()
		} catch (err) {
			setErrorMessage(getErrorMessage('update'))
		}
	}, [refetchEvents, getErrorMessage])

	// Handle event remove
	const handleEventRemove = useCallback(async (eventId) => {
		if (String(eventId).startsWith('gcal-')) {
			// Delete Google event locally
			const pureId = String(eventId).replace(/^gcal-/, '')
			try {
				await fetch(`/api/integrations/google-calendar/event-times/${pureId}`, {
					method: 'DELETE',
				})
				refetchEvents()
			} catch (err) {
				setErrorMessage('Error deleting local Google event')
			}
			return
		}
		try {
			await fetch(`/api/tasks/${eventId}`, {
				method: 'DELETE',
			})
			refetchEvents()
		} catch (err) {
			setErrorMessage(getErrorMessage('delete'))
		}
	}, [refetchEvents, getErrorMessage])

	// Handle add/edit task modal save
	const handleAddTaskSave = async (task) => {
		try {
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: task.title,
					description: task.desc || '',
					start: task.start,
					end: task.end,
					color: task.color || '#2563eb',
					durationSeconds: task.duration_seconds || 0,
					isFinished: false,
				}),
			})
			if (!res.ok) {
				const text = await res.text()
				setErrorMessage(getErrorMessage('create') + ': ' + text.slice(0, 200))
				return
			}
			setShowAddTaskModal(false)
			setDraftTask(null)
			refetchEvents()
		} catch (error) {
			setErrorMessage(getErrorMessage('create'))
		}
	}

	const handleEditTaskSave = async (task) => {
		if (!selectedEvent) return
		if (String(selectedEvent.id).startsWith('gcal-')) {
			// PATCH Google event time (local DB)
			const googleId = String(selectedEvent.id).replace(/^gcal-/, '')
			try {
				const res = await fetch(`/api/integrations/google-calendar/event-times/${googleId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: task.title,
						description: task.desc || '',
						start: task.start,
						end: task.end,
					}),
				})
				if (!res.ok) {
					const text = await res.text()
					setErrorMessage('Error updating Google event: ' + text.slice(0, 200))
					return
				}
				setShowEditTaskModal(false)
				setSelectedEvent(null)
				refetchEvents()
			} catch (err) {
				setErrorMessage('Error updating Google event')
			}
			return
		}
		try {
			const res = await fetch(`/api/tasks/${selectedEvent.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: task.title,
					description: task.desc || '',
					start: task.start,
					end: task.end,
					color: task.color || '#2563eb',
				}),
			})
			if (!res.ok) {
				const text = await res.text()
				setErrorMessage(getErrorMessage('update') + ': ' + text.slice(0, 200))
				return
			}
			setShowEditTaskModal(false)
			setSelectedEvent(null)
			refetchEvents()
		} catch (error) {
			setErrorMessage(getErrorMessage('update'))
		}
	}

	const handleEditTaskDelete = async () => {
		if (!selectedEvent) return
		if (String(selectedEvent.id).startsWith('gcal-')) {
			// Delete local Google event from modal
			const pureId = String(selectedEvent.id).replace(/^gcal-/, '')
			try {
				await fetch(`/api/integrations/google-calendar/event-times/${pureId}`, {
					method: 'DELETE',
				})
				setShowEditTaskModal(false)
				setSelectedEvent(null)
				refetchEvents()
			} catch (error) {
				setErrorMessage('Error deleting local Google event')
			}
			return
		}
		try {
			await fetch(`/api/tasks/${selectedEvent.id}`, {
				method: 'DELETE',
			})
			setShowEditTaskModal(false)
			setSelectedEvent(null)
			refetchEvents()
		} catch (error) {
			setErrorMessage(getErrorMessage('delete'))
		}
	}

	const handleStartTimerForTask = event => {
		if (timer.running && !timer.paused) return
		timer.start({ taskId: event.id })
	}

	// Calendar button text translations
	const calendarButtonText = useMemo(() => ({
		today: t('calendar.today') || 'Today',
		month: t('calendar.month') || 'Month',
		week: t('calendar.week') || 'Week',
		day: t('calendar.day') || 'Day',
		list: t('calendar.list') || 'List',
	}), [t])

	function mapTaskForCalendar(task) {
		if (!task) return task
		return {
			id: task.id || task._id,
			title: task.title,
			start: typeof task.start === 'string' || task.start instanceof Date ? task.start : (task.start ? new Date(task.start) : null),
			end: typeof task.end === 'string' || task.end instanceof Date ? task.end : (task.end ? new Date(task.end) : null),
			backgroundColor: task.color || '#2563eb',
			borderColor: task.color || '#2563eb',
			allDay: false,
			extendedProps: {
				...task,
				id: task.id || task._id,
				durationSeconds: typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0),
				isFinished: typeof task.isFinished === 'boolean' ? task.isFinished : (task.is_finished ?? false),
				is_finished: typeof task.is_finished === 'boolean' ? task.is_finished : (task.isFinished ?? false),
			},
		}
	}

	function mapGoogleEventForCalendar(event) {
		return {
			id: event.id, // already 'gcal-...'
			title: event.title || event.summary || '(Google event)',
			start: event.start ? new Date(event.start) : null,
			end: event.end ? new Date(event.end) : null,
			backgroundColor: '#34a853',
			borderColor: '#34a853',
			allDay: false,
			editable: true,
			classNames: ['google-calendar-event'],
			extendedProps: {
				...event,
				id: event.id,
				title: event.title || event.summary || '(Google event)',
				isGoogle: true,
				durationSeconds: typeof event.durationSeconds === 'number' ? event.durationSeconds : 0,
				is_finished: !!event.is_finished,
				isFinished: !!event.isFinished,
			},
		}
	}

	const handleImportGoogleEvents = async () => {
		try {
			const res = await fetch('/api/integrations/google-calendar/import', {
				method: 'POST',
			})
			if (!res.ok) {
				const data = await res.json()
				setErrorMessage(data.error || 'Error importing Google events')
				return
			}
			refetchEvents()
		} catch (err) {
			setErrorMessage('Error importing Google events')
		}
	}

	if (eventsLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-gray-600">{t('common.loading') || 'Loading...'}</div>
			</div>
		)
	}

	return (
		<div className='bg-white rounded-xl shadow p-2 md:p-4'>
			<div className='flex gap-2 mb-4'>
				<button
					className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
					onClick={() => setViewMode('calendar')}
				>
					{t('calendar.calendar') || 'Calendar'}
				</button>
				<button
					className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
					onClick={() => setViewMode('list')}
				>
					{t('calendar.list') || 'List'}
				</button>
				<button
					className='px-3 py-1 rounded bg-green-600 text-white cursor-pointer'
					onClick={handleImportGoogleEvents}
				>
					{t('calendar.importGoogle') || 'Import Google'}
				</button>
			</div>
			{viewMode === 'calendar' ? (
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
					initialView='timeGridWeek'
					headerToolbar={{
						left: 'prev,next today',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay'
					}}
					locale='en'
					buttonText={calendarButtonText}
					events={syncedEvents.map(e => e.isGoogle ? mapGoogleEventForCalendar(e) : mapTaskForCalendar(e))}
					selectable
					editable
					select={handleDateSelect}
					eventClick={handleEventClick}
					eventDrop={handleEventDrop}
					eventResize={handleEventDrop}
					dayMaxEvents={true}
					height='auto'
					eventContent={arg => {
						const eventProps = arg.event.extendedProps || {}
						const eventId = String(arg.event.id)
						const syncedEventObj = syncedEvents.find(e => String(e.id) === eventId) || eventProps
						const eventForTimer = {
							...syncedEventObj,
							id: eventId,
							title: arg.event.title,
							durationSeconds: typeof eventProps.durationSeconds === 'number' ? eventProps.durationSeconds : 0,
							isGoogle: !!eventProps.isGoogle,
							is_finished: !!eventProps.is_finished,
							isFinished: !!eventProps.isFinished,
						}

						// Add handleFinish for both local and Google events
						const handleFinish = async () => {
							let elapsed = 0
							if (timer.running && timer.task?.id === eventForTimer.id && timer.getElapsedSeconds) {
								elapsed = timer.getElapsedSeconds()
								timer.stop()
							}
							const newDuration = (eventForTimer.durationSeconds || 0) + elapsed
							if (String(eventForTimer.id).startsWith('gcal-')) {
								const googleId = String(eventForTimer.id).replace(/^gcal-/, '')
								try {
									const res = await fetch(`/api/integrations/google-calendar/event-times/${googleId}`, {
										method: 'PATCH',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({
											durationSeconds: newDuration,
											isFinished: true,
										}),
									})
									if (!res.ok) {
										const text = await res.text()
										console.error('Error completing Google event:', text)
										return
									}
									refetchEvents()
									return
								} catch (err) {
									console.error('Error completing Google event:', err)
									return
								}
							}
							try {
								const res = await fetch(`/api/tasks/${eventForTimer.id}`, {
									method: 'PUT',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({
										durationSeconds: newDuration,
										isFinished: true,
									}),
								})
								if (!res.ok) {
									const text = await res.text()
									console.error('Error completing task:', text)
									return
								}
								refetchEvents()
							} catch (err) {
								console.error('Error completing task:', err)
							}
						}

						return (
							<div className='flex items-center gap-2'>
								<span className='truncate'>{arg.event.title}</span>
								{arg.event.classNames?.includes('google-calendar-event') && (
									<span className='ml-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold'>Google</span>
								)}
								<CalendarEventTimerButton
									event={eventForTimer}
									timer={timer}
									disabled={eventForTimer.is_finished}
									onTaskUpdate={refetchEvents}
									onFinish={handleFinish}
								/>
							</div>
						)
					}}
				/>
			) : (				<TaskListView
					tasks={syncedEvents}
					onTaskUpdate={refetchEvents}
					user={user}
					lastSavedTaskId={lastSavedTaskId}
					lastSavedDuration={lastSavedDuration}
				/>
			)}
			<AddTaskModal
				open={showAddTaskModal}
				initialStart={draftTask?.start}
				initialEnd={draftTask?.end}
				onClose={() => {
					setShowAddTaskModal(false)
					setDraftTask(null)
					setErrorMessage('')
				}}
				onSave={handleAddTaskSave}
			/>
			<AddTaskModal
				open={showEditTaskModal}
				initialStart={selectedEvent?.start}
				initialEnd={selectedEvent?.end}
				initialTitle={selectedEvent?.title}
				initialDesc={selectedEvent?.extendedProps?.description}
				initialColor={selectedEvent?.backgroundColor}
				showDelete
				onClose={() => {
					setShowEditTaskModal(false)
					setSelectedEvent(null)
					setErrorMessage('')
				}}
				onSave={handleEditTaskSave}
				onDelete={handleEditTaskDelete}
			/>
			{errorMessage && (
				<div className='mb-2 p-2 bg-red-100 text-red-700 rounded text-center text-sm font-semibold'>
					{errorMessage}
				</div>
			)}
		</div>
	)
}

export default FullCalendarGrid
