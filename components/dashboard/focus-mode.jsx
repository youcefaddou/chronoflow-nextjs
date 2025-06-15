'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalTimer } from '../timer/global-timer-provider'
import { X, Play, Pause, Square } from 'lucide-react'

function FocusMode({ isOpen, onClose }) {
	const { t } = useTranslation()
	const {
		running,
		paused,
		task,
		getElapsedSeconds,
		pause,
		resume,
		stop
	} = useGlobalTimer()

	if (!isOpen) return null

	const formatTime = (seconds) => {
		const h = Math.floor(seconds / 3600)
		const m = Math.floor((seconds % 3600) / 60)
		const s = seconds % 60
		
		if (h > 0) {
			return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
		}
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
	}

	const elapsedSeconds = getElapsedSeconds()

	const handlePlayPause = () => {
		if (running && !paused) {
			pause()
		} else if (paused) {
			resume()
		}
	}

	const handleStop = () => {
		stop()
	}

	return (
		<div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
			{/* Background pattern */}
			<div 
				className="absolute inset-0 opacity-10"
				style={{
					backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
						radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
					backgroundSize: '50px 50px'
				}}
			/>
			
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-6 right-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
				aria-label={t('common.close') || 'Fermer'}
			>
				<X className="w-6 h-6" />
			</button>

			{/* Main content */}
			<div className="flex flex-col items-center justify-center min-h-screen p-8">
				{/* Task info */}
				{task && (
					<div className="text-center mb-8">
						<h1 className="text-2xl md:text-3xl font-light text-white/90 mb-2">
							{t('focusMode.workingOn') || 'Travail en cours sur'}
						</h1>
						<h2 className="text-3xl md:text-4xl font-semibold text-white">
							{task.title}
						</h2>
						{task.description && (
							<p className="text-lg text-white/70 mt-2 max-w-2xl">
								{task.description}
							</p>
						)}
					</div>
				)}

				{/* Timer display */}
				<div className="text-center mb-12">
					<div className="text-8xl md:text-9xl font-mono font-light text-white mb-4 tracking-wide">
						{formatTime(elapsedSeconds)}
					</div>
					<div className="text-xl text-white/60">
						{running 
							? (paused ? (t('timer.paused') || 'En pause') : (t('timer.running') || 'En cours'))
							: (t('timer.stopped') || 'Arrêté')
						}
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-6">
					{/* Play/Pause button */}
					<button
						onClick={handlePlayPause}
						disabled={!task}
						className="flex items-center justify-center w-20 h-20 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed rounded-full transition-all duration-200 group"
						aria-label={running && !paused ? (t('timer.pause') || 'Pause') : (t('timer.play') || 'Lecture')}
					>
						{running && !paused ? (
							<Pause className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
						) : (
							<Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
						)}
					</button>

					{/* Stop button */}
					<button
						onClick={handleStop}
						disabled={!running}
						className="flex items-center justify-center w-20 h-20 bg-red-500/30 hover:bg-red-500/50 disabled:bg-white/10 disabled:cursor-not-allowed rounded-full transition-all duration-200 group"
						aria-label={t('timer.stop') || 'Arrêter'}
					>
						<Square className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
					</button>
				</div>

				{/* Info text */}
				{!task && (
					<div className="text-center mt-8 text-white/50">
						<p className="text-lg">
							{t('focusMode.noTask') || 'Aucune tâche sélectionnée'}
						</p>
						<p className="text-sm mt-2">
							{t('focusMode.selectTaskFirst') || 'Sélectionnez une tâche pour commencer le minuteur'}
						</p>
					</div>
				)}

				{/* Keyboard shortcuts */}
				<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
					<div className="text-white/40 text-sm space-y-1">
						<p>
							<kbd className="px-2 py-1 bg-white/10 rounded text-xs">Espace</kbd> 
							{t('focusMode.shortcutPause') || ' pour pause/reprendre'}
						</p>
						<p>
							<kbd className="px-2 py-1 bg-white/10 rounded text-xs">Échap</kbd>
							{t('focusMode.shortcutClose') || ' pour fermer'}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FocusMode
