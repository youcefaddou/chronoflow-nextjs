'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const COLORS = [
	'#2563eb', // blue
	'#16a34a', // green
	'#eab308', // yellow
	'#f59e42', // orange
	'#e11d48', // red
	'#7c3aed', // purple
]

function AddTaskModal({ open, onClose, onSave, editTask = null, onDelete = null, showDelete = false, lang = 'fr' }) {
	const { t } = useTranslation()
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [color, setColor] = useState(COLORS[0])
	const [start, setStart] = useState(new Date())
	const [end, setEnd] = useState(new Date())

	// Initialize form with editTask data when modal opens
	React.useEffect(() => {
		if (open && editTask) {
			setTitle(editTask.title || '')
			setDescription(editTask.description || '')
			setColor(editTask.color || COLORS[0])
			setStart(editTask.start ? new Date(editTask.start) : new Date())
			setEnd(editTask.end ? new Date(editTask.end) : new Date())
		} else if (open && !editTask) {
			// Reset form for new task
			setTitle('')
			setDescription('')
			setColor(COLORS[0])
			setStart(new Date())
			setEnd(new Date())
		}
	}, [open, editTask])
	const handleSave = () => {
		if (!title.trim()) return

		const taskData = {
			title: title.trim(),
			description: description.trim(),
			color,
			start,
			end,
		}

		if (editTask) {
			taskData.id = editTask.id
		}

		onSave(taskData)
		handleClose()
	}

	const handleDelete = () => {
		if (editTask && onDelete) {
			onDelete()
		}
		handleClose()
	}

	const handleClose = () => {
		setTitle('')
		setDescription('')
		setColor(COLORS[0])
		setStart(new Date())
		setEnd(new Date())
		onClose()
	}

	if (!open) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fade-in'>
				<button
					className='absolute top-2 right-2 text-gray-500 hover:text-rose-600 text-2xl font-bold'
					onClick={handleClose}
					aria-label={t('common.close') || 'Close'}
				>
					&times;
				</button>
						<h2 className='text-xl font-bold mb-4 text-gray-900'>
					{editTask 
						? (t('tasks.editTask') || 'Edit Task')
						: (t('tasks.addTask') || 'Add Task')
					}
				</h2>

				<div className='flex flex-col gap-4'>					<input
						type='text'
						placeholder={t('tasks.taskTitle') || 'Task title'}
						value={title}
						onChange={e => setTitle(e.target.value)}
						className='border rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
						autoFocus
					/>
					
					<textarea
						placeholder={t('tasks.taskDescription') || 'Task description (optional)'}
						value={description}
						onChange={e => setDescription(e.target.value)}
						className='border rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
						rows={3}
					/>

					{/* Color selection */}
					<div className='flex items-center gap-2'>
						<span className='text-sm font-medium'>{t('common.color') || 'Color'}:</span>
						{COLORS.map(c => (
							<button
								key={c}
								type='button'
								className={`w-8 h-8 rounded-full border-2 transition-all ${
									color === c ? 'border-blue-600 scale-110' : 'border-gray-200 hover:border-gray-400'
								}`}
								style={{ background: c }}
								onClick={() => setColor(c)}
								aria-label={c}
							/>
						))}
					</div>

					{/* Date and time inputs */}
					<div className='grid grid-cols-2 gap-3'>
						<div>
							<label className='text-sm font-medium text-gray-600 block mb-1'>
								{t('common.start') || 'Start'}
							</label>							<input
								type='datetime-local'
								value={start.toISOString().slice(0, 16)}
								onChange={e => setStart(new Date(e.target.value))}
								className='border rounded px-3 py-2 text-sm text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div>
							<label className='text-sm font-medium text-gray-600 block mb-1'>
								{t('common.end') || 'End'}
							</label>
							<input
								type='datetime-local'
								value={end.toISOString().slice(0, 16)}
								onChange={e => setEnd(new Date(e.target.value))}
								className='border rounded px-3 py-2 text-sm text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>					{/* Action buttons */}
					<div className={`flex gap-3 mt-4 ${showDelete && editTask ? 'grid grid-cols-3' : ''}`}>
						{showDelete && editTask && (
							<button
								onClick={handleDelete}
								className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold text-sm hover:bg-red-200 transition"
							>
								{t('common.delete') || 'Delete'}
							</button>
						)}
						<button
							onClick={handleClose}
							className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-200 transition"
						>
							{t('common.cancel') || 'Cancel'}
						</button>
						<button
							onClick={handleSave}
							className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
							disabled={!title.trim()}
						>
							{editTask 
								? (t('common.update') || 'Update')
								: (t('common.save') || 'Save')
							}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AddTaskModal