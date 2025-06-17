'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalTimer } from '../timer/global-timer-provider'
import { useMobileMenu } from '../../hooks/use-responsive'
import { MobileMenuToggle, MobileOptimizedButton, ResponsiveContainer } from '../ui/responsive-components'
import FocusZoneModal from './FocusZoneModal'
import CalendarSelectorModal from './CalendarSelectorModal'
import FullCalendarGrid from './FullCalendarGrid'
import SaveTimerModal from './SaveTimerModal'
import TaskListView from './TaskListView'

function getWeekNumber(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	const dayNum = d.getUTCDay() || 7
	d.setUTCDate(d.getUTCDate() + 4 - dayNum)
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

function getMondayOfWeek(date) {
	const d = new Date(date)
	const day = d.getDay() || 7
	d.setDate(d.getDate() - day + 1)
	d.setHours(0, 0, 0, 0)
	return d
}

function DashboardHeader({ user, sidebarCollapsed, setSidebarCollapsed }) {
	const { t } = useTranslation()
	const timer = useGlobalTimer()
	const { isMenuOpen, toggleMenu, closeMenu, isMobile } = useMobileMenu()
	const [seconds, setSeconds] = useState(0)
	const [showZone, setShowZone] = useState(false)
	const [showCalendar, setShowCalendar] = useState(false)
	const [showSaveTimer, setShowSaveTimer] = useState(false)
	const [elapsedSecondsToSave, setElapsedSecondsToSave] = useState(0)
	const [selectedDate, setSelectedDate] = useState(getMondayOfWeek(new Date()))
	const [selectedRange, setSelectedRange] = useState('this-week')
	const [externalDate, setExternalDate] = useState(null)
	const [refreshKey, setRefreshKey] = useState(0)
	const [lastSavedTaskId, setLastSavedTaskId] = useState(null)
	const [lastSavedDuration, setLastSavedDuration] = useState(0)

	const weekNumber = getWeekNumber(selectedDate)
	const year = selectedDate.getFullYear()

	const handleStartPause = () => {
		if (!timer.running) {
			timer.start()
		} else if (timer.paused) {
			timer.resume()
		} else {
			timer.pause()
		}
	}

	const handleStop = async () => {
		if ((timer.running || safeSeconds > 0) && timer.task && timer.task.id) {
			const isGoogleEvent = !!timer.task.isGoogle || String(timer.task.id).startsWith('gcal-')
			const taskId = timer.task.id
			try {
				if (isGoogleEvent) {
					// For Google events, POST to the Google Calendar event-times endpoint
					const eventId = String(taskId).replace(/^gcal-/, '')
					await fetch('/api/integrations/google-calendar/event-times', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						credentials: 'include',
						body: JSON.stringify({ eventId, durationSeconds: safeSeconds }),
					})
				} else {
					// Local task: update via /api/tasks/:id
					await fetch(`/api/tasks/${taskId}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						credentials: 'include',
						body: JSON.stringify({
							durationSeconds: safeSeconds,
						}),
					})
				}
			} catch (err) {
				console.error('Error saving time:', err)
			}
			timer.stop()
			setSeconds(0)
			setRefreshKey(k => k + 1)
		} else if (timer.running || safeSeconds > 0) {
			// Timer WITHOUT task → open creation modal
			setElapsedSecondsToSave(safeSeconds)
			setShowSaveTimer(true)
		} else {
			// Safety: if timer already stopped
			timer.stop()
			setSeconds(0)
		}
	}

	const handleSaveTimer = async (taskData) => {
		if (!user || !user.id) {
			alert('User not authenticated')
			return
		}
		try {
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					title: taskData.title,
					description: taskData.desc || '',
					start: taskData.start.toISOString(),
					end: taskData.end.toISOString(),
					color: taskData.color || '#2563eb',
					durationSeconds: taskData.duration_seconds || 0,
					is_finished: true,
				}),
			})
			const data = await res.json()
			if (!res.ok) {
				console.error('Error saving:', data.message || data.error)
				alert('Error saving: ' + (data.message || data.error))
				return
			}
			setShowSaveTimer(false)
			setElapsedSecondsToSave(0)
			timer.stop()
			setSeconds(0)
			setLastSavedTaskId(data.id || data._id)
			setLastSavedDuration(taskData.duration_seconds || 0)
			setRefreshKey(k => k + 1)
		} catch (err) {
			console.error('Error saving (exception):', err)
			alert('Error saving: ' + err.message)
		}
	}

	const handleZone = () => setShowZone(true)
	const handleCloseZone = () => setShowZone(false)
	const handleOpenCalendar = () => setShowCalendar(true)
	const handleCloseCalendar = () => setShowCalendar(false)

	const handleSelectCalendar = (range, date) => {
		setSelectedRange(range)
		setSelectedDate(getMondayOfWeek(date))
		setShowCalendar(false)
	}

	const handlePrevWeek = () => {
		const prev = new Date(selectedDate)
		prev.setDate(prev.getDate() - 7)
		setSelectedDate(getMondayOfWeek(prev))
		setSelectedRange('this-week')
	}

	const handleNextWeek = () => {
		const next = new Date(selectedDate)
		next.setDate(next.getDate() + 7)
		const maxWeek = getWeekNumber(new Date(selectedDate.getFullYear(), 11, 28))
		const nextWeek = getWeekNumber(next)
		if (nextWeek <= maxWeek) {
			setSelectedDate(getMondayOfWeek(next))
			setSelectedRange('this-week')
		}
	}

	// Allow CalendarGrid to change the displayed week from outside
	const handleExternalDateChange = date => {
		setSelectedRange('this-week')
		setSelectedDate(getMondayOfWeek(date))
		setExternalDate(date)
	}

	// Live update seconds from timer
	useEffect(() => {
		const update = () => setSeconds(timer.getElapsedSeconds ? timer.getElapsedSeconds() : 0)
		update()
		const interval = setInterval(update, 1000)
		return () => clearInterval(interval)
	}, [timer, timer.running, timer.paused])

	useEffect(() => {
		function preventCopyPaste(e) {
			e.preventDefault()
			return false
		}
		document.addEventListener('copy', preventCopyPaste, true)
		document.addEventListener('cut', preventCopyPaste, true)
		document.addEventListener('paste', preventCopyPaste, true)
		document.addEventListener('contextmenu', preventCopyPaste, true)
		return () => {
			document.removeEventListener('copy', preventCopyPaste, true)
			document.removeEventListener('cut', preventCopyPaste, true)
			document.removeEventListener('paste', preventCopyPaste, true)
			document.removeEventListener('contextmenu', preventCopyPaste, true)
		}
	}, [])

	// Reset lastSavedTaskId/lastSavedDuration after refresh to avoid restart loop
	useEffect(() => {
		if (lastSavedTaskId || lastSavedDuration) {
			const timeout = setTimeout(() => {
				setLastSavedTaskId(null)
				setLastSavedDuration(0)
			}, 2000)
			return () => clearTimeout(timeout)
		}
	}, [lastSavedTaskId, lastSavedDuration])
	const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0

	// Formatage du temps pour l'affichage
	const formatTime = (totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60)
		const secs = totalSeconds % 60
		return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

	return (
		<ResponsiveContainer>
			<header className='dashboard-header'>
				{/* Mobile menu toggle */}
				{isMobile && (
					<div className="flex items-center justify-between w-full mb-2">
						<MobileMenuToggle 
							isOpen={isMenuOpen} 
							onToggle={toggleMenu}
						/>
						<h1 className="text-lg font-semibold text-gray-800">
							{t('dashboard.title') || 'Dashboard'}
						</h1>
						<div className="w-8" /> {/* Spacer for centering */}
					</div>
				)}

				{/* Timer section */}
				<div className={`flex items-center gap-2 ${isMobile ? 'justify-center w-full' : 'gap-4'}`}>
					<div className={`font-mono text-blue-700 text-center ${
						isMobile ? 'text-2xl w-20' : 'text-3xl w-24'
					}`}>
						{formatTime(safeSeconds)}
					</div>
					
					{/* Timer controls */}
					<div className="flex items-center gap-2">
						<MobileOptimizedButton
							onClick={handleStartPause}
							variant={!timer.running || timer.paused ? 'primary' : 'secondary'}
							size={isMobile ? 'sm' : 'md'}
							className={`rounded-full border flex items-center ${
								!timer.running
									? 'bg-blue-100 hover:bg-blue-200 border-blue-200'
									: timer.paused
										? 'bg-blue-100 hover:bg-blue-200 border-blue-200'
										: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200'
							}`}
						>
							{!timer.running || timer.paused ? (
								<svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} fill='none' viewBox='0 0 20 20'>
									<polygon points='6,4 16,10 6,16' fill='#2563eb'/>
								</svg>
							) : (
								<svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} fill='none' viewBox='0 0 20 20'>
									<rect x='5' y='4' width='3' height='12' rx='1' fill='#eab308'/>
									<rect x='12' y='4' width='3' height='12' rx='1' fill='#eab308'/>
								</svg>
							)}
						</MobileOptimizedButton>

						<MobileOptimizedButton
							onClick={handleStop}
							disabled={!timer.running && safeSeconds === 0}
							variant="outline"
							size={isMobile ? 'sm' : 'md'}
							className={`rounded-full border flex items-center ${
								timer.running || safeSeconds > 0 
									? 'bg-rose-100 hover:bg-rose-200 border-rose-200' 
									: 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
							}`}
						>
							<svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} fill='none' viewBox='0 0 20 20'>
								<rect x='5' y='5' width='10' height='10' rx='2' fill='#e11d48'/>
							</svg>
						</MobileOptimizedButton>

						{/* Focus mode button - peut être caché sur très petit écran */}
						{!isMobile && (
							<button
								onClick={handleZone}
								className='relative p-2 rounded-full bg-rose-100 hover:bg-rose-200 cursor-pointer border border-rose-200 flex items-center group'
								aria-label='Get in the zone'
							>
								<svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
									<circle cx='10' cy='10' r='8' stroke='#e11d48' strokeWidth='2'/>
									<circle cx='10' cy='10' r='3' fill='#e11d48'/>
								</svg>
								<span className='absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-200'>
									{t('dashboard.focusMode') || 'Enable focus mode: timer starts and all distractions are hidden.'}
								</span>
							</button>
						)}
					</div>
				</div>

				{/* Mobile focus mode button */}
				{isMobile && (
					<div className="w-full flex justify-center mt-2">
						<MobileOptimizedButton
							onClick={handleZone}
							variant="outline"
							size="sm"
							className="bg-rose-100 hover:bg-rose-200 border-rose-200 text-rose-700"
						>
							<svg width='16' height='16' fill='none' viewBox='0 0 20 20' className="mr-2">
								<circle cx='10' cy='10' r='8' stroke='currentColor' strokeWidth='2'/>
								<circle cx='10' cy='10' r='3' fill='currentColor'/>
							</svg>
							{t('dashboard.focusMode') || 'Focus Mode'}
						</MobileOptimizedButton>
					</div>
				)}
			</header>			{/* Modals */}
			{showZone && (
				<FocusZoneModal
					seconds={seconds}
					running={timer.running}
					isPaused={timer.paused}
					onStartPause={handleStartPause}
					onStop={handleStop}
					onClose={handleCloseZone}
				/>
			)}
			{showCalendar && (
				<CalendarSelectorModal
					onClose={handleCloseCalendar}
					onSelect={handleSelectCalendar}
					selectedRange={selectedRange}
					selectedDate={selectedDate}
				/>
			)}
			{showSaveTimer && (
				<SaveTimerModal
					open={showSaveTimer}
					elapsedSeconds={elapsedSecondsToSave}
					onClose={() => {
						setShowSaveTimer(false)
						setElapsedSecondsToSave(0)
						timer.stop()
						setSeconds(0)
					}}
					onSave={handleSaveTimer}
				/>
			)}
			
			{/* Main content */}
			<div className='dashboard-main'>
				<div className='calendar-container'>
					<FullCalendarGrid
						user={user}
						refreshKey={refreshKey}
						lastSavedTaskId={lastSavedTaskId}
						lastSavedDuration={lastSavedDuration}
					/>
				</div>
			</div>		</ResponsiveContainer>
	)
}

export default DashboardHeader
