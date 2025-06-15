'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Plus, Search, Clock, Tag } from 'lucide-react'

export default function FocusZoneModal({ onClose, onTaskSelect, user }) {
	const { t } = useTranslation()
	const [tasks, setTasks] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [newTaskTitle, setNewTaskTitle] = useState('')

	// Charger les tâches
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const res = await fetch('/api/tasks', {
					credentials: 'include'
				})
				if (res.ok) {
					const data = await res.json()
					setTasks(data.filter(task => !task.is_finished))
				}
			} catch (error) {
				console.error('Erreur lors du chargement des tâches:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchTasks()
	}, [])

	// Filtrer les tâches
	const filteredTasks = tasks.filter(task =>
		task.title.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Créer une nouvelle tâche
	const handleCreateTask = async () => {
		if (!newTaskTitle.trim()) return

		try {
			const res = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					title: newTaskTitle.trim(),
					description: '',
					start: new Date().toISOString(),
					end: new Date(Date.now() + 3600000).toISOString(), // +1 heure
					color: '#2563eb',
					durationSeconds: 0,
					is_finished: false,
				}),
			})

			if (res.ok) {
				const newTask = await res.json()
				setTasks(prev => [newTask, ...prev])
				setNewTaskTitle('')
				setShowCreateForm(false)
				onTaskSelect(newTask)
			}
		} catch (error) {
			console.error('Erreur lors de la création de la tâche:', error)
		}
	}

	// Démarrer sans tâche
	const handleStartWithoutTask = () => {
		onTaskSelect(null)
	}

	// Sélectionner une tâche
	const handleSelectTask = (task) => {
		onTaskSelect(task)
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<div className="flex items-center space-x-3">
						<Clock className="w-5 h-5 text-blue-600" />
						<h3 className="text-lg font-semibold text-gray-900">
							{t('focusZone.title', 'Zone de focus')}
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
				<div className="flex-1 overflow-hidden flex flex-col">
					{/* Search */}
					<div className="p-4 border-b">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder={t('focusZone.searchPlaceholder', 'Rechercher une tâche...')}
							/>
						</div>
					</div>

					{/* Task List */}
					<div className="flex-1 overflow-y-auto p-4">
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						) : (
							<div className="space-y-2">
								{/* Bouton créer nouvelle tâche */}
								{!showCreateForm ? (
									<button
										onClick={() => setShowCreateForm(true)}
										className="w-full flex items-center space-x-3 p-3 text-left border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
									>
										<Plus className="w-4 h-4 text-gray-500" />
										<span className="text-gray-600">{t('focusZone.createNew', 'Créer une nouvelle tâche')}</span>
									</button>
								) : (
									<div className="p-3 border border-gray-300 rounded-md space-y-3">
										<input
											type="text"
											value={newTaskTitle}
											onChange={(e) => setNewTaskTitle(e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder={t('focusZone.newTaskPlaceholder', 'Nom de la nouvelle tâche...')}
											autoFocus
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
													handleCreateTask()
												}
											}}
										/>
										<div className="flex space-x-2">
											<button
												onClick={handleCreateTask}
												disabled={!newTaskTitle.trim()}
												className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
											>
												{t('common.create', 'Créer')}
											</button>
											<button
												onClick={() => {
													setShowCreateForm(false)
													setNewTaskTitle('')
												}}
												className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
											>
												{t('common.cancel', 'Annuler')}
											</button>
										</div>
									</div>
								)}

								{/* Liste des tâches */}
								{filteredTasks.map((task) => (
									<button
										key={task.id || task._id}
										onClick={() => handleSelectTask(task)}
										className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
									>
										<div 
											className="w-3 h-3 rounded-full flex-shrink-0"
											style={{ backgroundColor: task.color || '#2563eb' }}
										/>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-gray-900 truncate">
												{task.title}
											</div>
											{task.description && (
												<div className="text-sm text-gray-500 truncate">
													{task.description}
												</div>
											)}
										</div>
										<Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
									</button>
								))}

								{filteredTasks.length === 0 && !loading && searchTerm && (
									<div className="text-center py-8 text-gray-500">
										{t('focusZone.noResults', 'Aucune tâche trouvée')}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between p-6 border-t bg-gray-50">
					<button
						onClick={handleStartWithoutTask}
						className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
					>
						{t('focusZone.startWithoutTask', 'Démarrer sans tâche')}
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
					>
						{t('common.cancel', 'Annuler')}
					</button>
				</div>
			</div>
		</div>
	)
}
