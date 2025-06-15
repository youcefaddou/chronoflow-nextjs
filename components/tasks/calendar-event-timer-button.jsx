'use client'

import React, { useState } from 'react'

function CalendarEventTimerButton({ event, timer, lang, disabled, onTaskUpdate }) {
	const [saving, setSaving] = useState(false)
	const isRunning = timer.running && String(timer.task?.id) === String(event.id)
	const isPaused = isRunning && timer.paused

	// Détection fiable du type d'événement Google
	const isGoogleEvent = !!event.isGoogle || String(event.id).startsWith('gcal-')
	const effectiveDisabled = disabled

	const handlePlayPause = e => {
		e.stopPropagation()
		e.preventDefault()
		if (effectiveDisabled) return
		
		const eventForTimer = { ...event, id: String(event.id), isGoogle: isGoogleEvent }
		
		// Prevent duplicate timer start for the same event
		if (isRunning) {
			if (isPaused) {
				timer.resume()
			} else {
				timer.pause()
			}
		} else {
			if (typeof timer.startFrom === 'function') {
				timer.startFrom(event.durationSeconds || 0, eventForTimer)
			} else if (typeof timer.start === 'function') {
				timer.start(eventForTimer, event.durationSeconds || 0)
			}
		}
	}

	const handleStop = async e => {
		e.stopPropagation()
		e.preventDefault()
		if (effectiveDisabled) return
		if (!isRunning) return
		
		setSaving(true)
		const newDuration = timer.getElapsedSeconds ? timer.getElapsedSeconds() : 0
		
		try {
			if (!timer.task || timer.task.id !== event.id) {
				if (typeof timer.setTask === 'function') {
					timer.setTask(event)
				}
			}

			if (!event.id && !event._id) {
				console.warn('handleStop: event.id/_id is missing, aborting stop')
				setSaving(false)
				if (onTaskUpdate) onTaskUpdate(event.id, newDuration)
				return
			}			if (isGoogleEvent) {
				// Toujours retirer le préfixe gcal- pour la DB/API
				const eventId = String(event.id).replace(/^gcal-/, '')
				const res = await fetch('/api/integrations/google-calendar/event-times', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ eventId, durationSeconds: newDuration }),
				})
				
				if (!res.ok) {
					const text = await res.text()
					console.error('Erreur lors de la mise à jour du timer Google:', text)
					alert('Erreur lors de la mise à jour du timer: ' + text.slice(0, 200))
					setSaving(false)
					if (onTaskUpdate) onTaskUpdate(event.id, newDuration)
					return
				}
			} else {
				if (String(event.id).startsWith('gcal-')) {
					console.error('Tentative d\'appel de la route locale avec un id Google, operation annulee')
					setSaving(false)
					if (onTaskUpdate) onTaskUpdate(event.id, newDuration)
					return
				}
				
				const eventId = event.id || event._id
				const res = await fetch(`/api/tasks/${eventId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ durationSeconds: newDuration }),
				})
				
				if (!res.ok) {
					const text = await res.text()
					console.error('Erreur lors de la mise à jour du timer:', text)
					alert('Erreur lors de la mise à jour du timer: ' + text.slice(0, 200))
					setSaving(false)
					if (onTaskUpdate) onTaskUpdate(event.id, newDuration)
					return
				}
			}
			
			if (typeof timer.stop === 'function') {
				timer.stop()
			}
			setSaving(false)
			if (onTaskUpdate) onTaskUpdate(event.id, newDuration)
		} catch (err) {
			console.error('Erreur lors de la mise à jour du timer:', err)
			setSaving(false)
			if (onTaskUpdate) onTaskUpdate(event.id, newDuration)
		}
	}

	return (
		<div className='flex items-center gap-1 task-timer-buttons'>
			<button
				onClick={handlePlayPause}
				title={isRunning ? (isPaused ? (lang === 'fr' ? 'Reprendre' : 'Resume') : (lang === 'fr' ? 'Pause' : 'Pause')) : (lang === 'fr' ? 'Démarrer le timer' : 'Start timer')}
				aria-label={isRunning ? (isPaused ? (lang === 'fr' ? 'Reprendre' : 'Resume') : (lang === 'fr' ? 'Pause' : 'Pause')) : (lang === 'fr' ? 'Démarrer le timer' : 'Start timer')}
				className={`p-1 rounded-full ${isRunning ? (isPaused ? 'bg-yellow-100' : 'bg-yellow-200') : 'bg-blue-100 hover:bg-blue-200'} flex items-center justify-center cursor-pointer transition-colors`}
				disabled={saving || effectiveDisabled}
				data-timer-button="true"
			>
				{!isRunning ? (
					<svg width="10" height="10" fill="none" viewBox="0 0 20 20">
						<polygon points="6,4 16,10 6,16" fill="#2563eb" />
					</svg>
				) : isPaused ? (
					<svg width="10" height="10" fill="none" viewBox="0 0 20 20">
						<polygon points="6,4 16,10 6,16" fill="#eab308" />
					</svg>
				) : (
					<svg width="10" height="10" fill="none" viewBox="0 0 20 20">
						<rect x="5" y="4" width="3" height="12" rx="1" fill="#eab308" />
						<rect x="12" y="4" width="3" height="12" rx="1" fill="#eab308" />
					</svg>
				)}
			</button>
			{isRunning && (
				<button
					onClick={handleStop}
					title={lang === 'fr' ? 'Arrêter le timer' : 'Stop timer'}
					aria-label={lang === 'fr' ? 'Arrêter le timer' : 'Stop timer'}
					className="p-1 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center cursor-pointer ml-1 transition-colors"
					disabled={saving || effectiveDisabled}
					data-timer-button="true"
				>
					<svg width="14" height="14" fill="none" viewBox="0 0 20 20">
						<rect x="5" y="5" width="10" height="10" rx="2" fill="#e11d48" />
					</svg>
				</button>
			)}
		</div>
	)
}

export default CalendarEventTimerButton
