'use client'

import React, { useState, useEffect } from 'react'
import { useGlobalTimer } from './global-timer-provider'
import TimerDisplay from './timer-display'
import { useTranslation } from 'react-i18next'
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react'

export default function Timer({ onSaveTimer, onOpenFocusZone, showSaveModal = false }) {
	const timer = useGlobalTimer()
	const { t } = useTranslation()
	const [seconds, setSeconds] = useState(0)

	// Live update seconds from timer
	useEffect(() => {
		const update = () => setSeconds(timer.getElapsedSeconds ? timer.getElapsedSeconds() : 0)
		update()
		const interval = setInterval(update, 1000)
		return () => clearInterval(interval)
	}, [timer, timer.running, timer.paused])
	
	const handleStartPause = () => {
		if (!timer.running) {
			// Démarrer le timer (avec ou sans tâche)
			timer.start(timer.task)
		} else if (timer.paused) {
			timer.resume()
		} else {
			timer.pause()
		}
	}

	const handleStop = () => {
		if ((timer.running || seconds > 0) && timer.task && (timer.task.id || timer.task._id)) {
			// Timer avec tâche - sauvegarde automatique via le provider
			timer.stop()
			setSeconds(0)
		} else if (timer.running || seconds > 0) {
			// Timer sans tâche - ouvrir modale de sauvegarde
			if (onSaveTimer) {
				onSaveTimer(seconds)
			}
			timer.stop()
			setSeconds(0)
		} else {
			// Timer déjà arrêté
			timer.stop()
			setSeconds(0)
		}
	}

	const handleReset = () => {
		timer.stop()
		setSeconds(0)
	}

	const isRunning = timer.running && !timer.paused
	const isPaused = timer.running && timer.paused
	const safeSeconds = seconds || 0
	return (
		<div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
			{/* Affichage du timer */}
			<div className="flex items-center space-x-3">
				<div className="flex items-center space-x-2 text-gray-600">
					<Clock className="w-4 h-4" />
					<span className="text-sm font-medium">
						{timer.task ? timer.task.title || t('timer.currentTask') : t('timer.noTask')}
					</span>
				</div>
				<TimerDisplay
					duration={safeSeconds}
					isRunning={timer.running}
					isPaused={timer.paused}
					getElapsedSeconds={timer.getElapsedSeconds}
					className="text-1xl text-blue-600 font-mono"
				/>
			</div>

			{/* Contrôles du timer */}
			<div className="flex items-center space-x-2">
				{/* Bouton Start/Pause */}
				<button
					onClick={handleStartPause}
					className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
						isRunning 
							? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
							: 'bg-green-500 hover:bg-green-600 text-white'
					}`}
					title={isRunning ? t('timer.pause') : (isPaused ? t('timer.resume') : t('timer.start'))}
				>
					{isRunning ? (
						<Pause className="w-6 h-6" />
					) : (
						<Play className="w-6 h-6 ml-0.5" />
					)}
				</button>

				{/* Bouton Stop */}
				<button
					onClick={handleStop}
					disabled={!timer.running && safeSeconds === 0}
					className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-200"
					title={t('timer.stop')}
				>
					<Square className="w-6 h-6" />
				</button>

				{/* Bouton Reset */}
				<button
					onClick={handleReset}
					disabled={!timer.running && safeSeconds === 0}
					className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-200"
					title={t('timer.reset')}
				>
					<RotateCcw className="w-6 h-6" />
				</button>
			</div>

			{/* Statut compact */}
			{timer.running && (
				<div className="flex items-center space-x-1">
					<div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
					<span className="text-xs text-gray-600">
						{isRunning ? t('timer.running') : t('timer.paused')}
					</span>
				</div>
			)}
		</div>
	)
}
