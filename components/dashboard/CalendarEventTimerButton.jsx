'use client'

import React from 'react'
import { useGlobalTimer } from '../timer/global-timer-provider'
import { useTranslation } from 'react-i18next'

function CalendarEventTimerButton({ event, className = '' }) {
	const { t } = useTranslation()
	const timer = useGlobalTimer()

	const handleStartTimer = (e) => {
		e.stopPropagation()
		
		// Set the current task in the timer
		timer.setTask({
			id: event.id,
			title: event.title,
			description: event.description || '',
			color: event.color || '#2563eb',
			isGoogle: event.isGoogle || false,
		})
		
		// Start the timer
		timer.start()
	}

	const isCurrentTask = timer.task && timer.task.id === event.id
	const isRunning = timer.running && isCurrentTask

	return (
		<button
			onClick={handleStartTimer}
			className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${
				isRunning
					? 'bg-green-100 text-green-600 hover:bg-green-200'
					: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
			} ${className}`}
			title={isRunning 
				? (t('timer.running') || 'Timer is running')
				: (t('timer.startTimer') || 'Start timer for this task')
			}
			aria-label={isRunning 
				? (t('timer.running') || 'Timer is running')
				: (t('timer.startTimer') || 'Start timer for this task')
			}
		>
			{isRunning ? (
				<svg width='16' height='16' fill='none' viewBox='0 0 16 16'>
					<rect x='3' y='3' width='2' height='10' rx='1' fill='currentColor'/>
					<rect x='11' y='3' width='2' height='10' rx='1' fill='currentColor'/>
				</svg>
			) : (
				<svg width='16' height='16' fill='none' viewBox='0 0 16 16'>
					<polygon points='5,3 13,8 5,13' fill='currentColor'/>
				</svg>
			)}
		</button>
	)
}

export default CalendarEventTimerButton