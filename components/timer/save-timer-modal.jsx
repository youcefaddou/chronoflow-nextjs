'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Clock, Save } from 'lucide-react'

export default function SaveTimerModal({ 
	onClose, 
	onSave, 
	currentTime, 
	elapsedSeconds = 0 
}) {
	const { t } = useTranslation()
	const [taskTitle, setTaskTitle] = useState('')
	const [taskDescription, setTaskDescription] = useState('')
	const [saving, setSaving] = useState(false)

	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}

	const handleSave = async () => {
		if (!taskTitle.trim()) return

		setSaving(true)
		try {
			const taskData = {
				title: taskTitle.trim(),
				description: taskDescription.trim(),
				start: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
				end: new Date().toISOString(),
				color: '#2563eb',
				duration_seconds: elapsedSeconds,
			}
			
			await onSave(taskData)
			onClose()
		} catch (error) {
			console.error('Erreur lors de la sauvegarde:', error)
		} finally {
			setSaving(false)
		}
	}

	const handleCancel = () => {
		onClose()
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<div className="flex items-center space-x-3">
						<Clock className="w-5 h-5 text-blue-600" />
						<h3 className="text-lg font-semibold text-gray-900">
							{t('timer.saveSession', 'Sauvegarder la session')}
						</h3>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					{/* Temps écoulé */}
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-2xl font-mono font-bold text-blue-600">
							{formatTime(elapsedSeconds)}
						</div>
						<div className="text-sm text-blue-600 mt-1">
							{t('timer.timeElapsed', 'Temps écoulé')}
						</div>
					</div>

					{/* Titre de la tâche */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('timer.taskTitle', 'Nom de la tâche')} *
						</label>
						<input
							type="text"
							value={taskTitle}
							onChange={(e) => setTaskTitle(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder={t('timer.taskTitlePlaceholder', 'Ex: Développement feature X')}
							autoFocus
						/>
					</div>

					{/* Description (optionnelle) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t('timer.taskDescription', 'Description')} ({t('common.optional', 'optionnel')})
						</label>
						<textarea
							value={taskDescription}
							onChange={(e) => setTaskDescription(e.target.value)}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
							placeholder={t('timer.taskDescriptionPlaceholder', 'Détails sur le travail effectué...')}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
					<button
						onClick={handleCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
						disabled={saving}
					>
						{t('common.cancel', 'Annuler')}
					</button>
					<button
						onClick={handleSave}
						disabled={!taskTitle.trim() || saving}
						className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<Save className="w-4 h-4" />
						<span>
							{saving 
								? t('common.saving', 'Sauvegarde...') 
								: t('common.save', 'Sauvegarder')
							}
						</span>
					</button>
				</div>
			</div>
		</div>
	)
}
