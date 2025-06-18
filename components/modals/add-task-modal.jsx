'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import usePlanLimits from '../../hooks/use-plan-limits'
import { PlanLimitModal } from '../common/plan-limit-alert'

const COLORS = [
	'#2563eb', // blue
	'#16a34a', // green
	'#eab308', // yellow
	'#f59e42', // orange
	'#e11d48', // red
	'#7c3aed', // purple
]

function getWeekNumber(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	const dayNum = d.getUTCDay() || 7
	d.setUTCDate(d.getUTCDate() + 4 - dayNum)
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// Helper to format date as local ISO string for datetime-local input
function toLocalISOString(date) {
	if (!date) return '';
	const pad = n => n.toString().padStart(2, '0');
	const yyyy = date.getFullYear();
	const mm = pad(date.getMonth() + 1);
	const dd = pad(date.getDate());
	const hh = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function MiniCalendar({ value, onChange }) {
	const [month, setMonth] = useState(value.getMonth())
	const [year, setYear] = useState(value.getFullYear())

	const startOfMonth = new Date(year, month, 1)
	const endOfMonth = new Date(year, month + 1, 0)
	const startDay = (startOfMonth.getDay() + 6) % 7 // lundi = 0
	const daysInMonth = endOfMonth.getDate()

	const weeks = []
	let week = []
	for (let i = 0; i < startDay; i++) week.push(null)
	for (let d = 1; d <= daysInMonth; d++) {
		week.push(new Date(year, month, d))
		if (week.length === 7) {
			weeks.push(week)
			week = []
		}
	}
	if (week.length) {
		while (week.length < 7) week.push(null)
		weeks.push(week)
	}

	return (
		<div className='bg-white rounded-lg shadow p-3 mt-2'>
			{/* Affiche la semaine sélectionnée avec le numéro réel */}
			<div className="mb-2 text-center font-semibold text-blue-700">
				Cette semaine - S{getWeekNumber(value)}
			</div>
			<div className='flex justify-between items-center mb-2'>
				<button
					onClick={() => {
						if (month === 0) {
							setMonth(11)
							setYear(y => y - 1)
						} else setMonth(m => m - 1)
					}}
					className='px-2 py-1 text-gray-500 hover:text-blue-700'
				>
					{'<'}
				</button>
				<span className='font-semibold text-sm'>
					{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
				</span>
				<button
					onClick={() => {
						if (month === 11) {
							setMonth(0)
							setYear(y => y + 1)
						} else setMonth(m => m + 1)
					}}
					className='px-2 py-1 text-gray-500 hover:text-blue-700'
				>
					{'>'}
				</button>
			</div>
			<div className='grid grid-cols-7 gap-1 text-xs text-center'>
				{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
					<span key={d} className='font-bold text-gray-400'>{d}</span>
				))}
				{weeks.flat().map((d, i) =>
					d ? (
						<button
							key={i}
							onClick={() => onChange(d)}
							className={`rounded-full w-7 h-7 ${
								d.toDateString() === value.toDateString()
									? 'bg-blue-600 text-white'
									: 'hover:bg-blue-100 text-gray-700'
							}`}
						>
							{d.getDate()}
						</button>
					) : (
						<span key={i} />
					)
				)}
			</div>
		</div>
	)
}

function AddTaskModal({ 
	open, 
	initialStart, 
	initialEnd, 
	initialTitle = '', 
	initialDesc = '', 
	initialColor = COLORS[0], 
	showDelete = false, 
	onClose, 
	onSave, 
	onDelete, 
	onStartTimer, 
	lang: langProp 
}) {
	const { t, i18n } = useTranslation()
	const { canCreateTask, getLimitMessage, updateStats } = usePlanLimits()
	const lang = langProp || (i18n?.language?.startsWith('en') ? 'en' : 'fr')
	const [title, setTitle] = useState(initialTitle)
	const [desc, setDesc] = useState(initialDesc)
	const [start, setStart] = useState(initialStart || new Date())
	const [end, setEnd] = useState(initialEnd || new Date())
	const [color, setColor] = useState(initialColor)
	const [showLimitModal, setShowLimitModal] = useState(false)

	useEffect(() => {
		setTitle(initialTitle)
		setDesc(initialDesc)
		setStart(initialStart || new Date())
		setEnd(initialEnd || new Date())
		setColor(initialColor)	}, [initialTitle, initialDesc, initialStart, initialEnd, initialColor])

	// Ajout d'un gestionnaire de soumission explicite
	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Validation
		if (!title.trim()) return;
		if (!start || !end) return;
		
		// Vérifier la limite pour les nouvelles tâches (pas pour les modifications)
		if (!showDelete && !canCreateTask()) {
			setShowLimitModal(true)
			return
		}
		
		// Créer l'objet tâche
		const task = {
			title: title.trim(),
			desc: desc.trim(),
			start,
			end,
			color
		};
		
		// Appeler onSave avec les données de la tâche
		onSave && onSave(task);
		
		// Mettre à jour les statistiques si c'est une nouvelle tâche
		if (!showDelete) {
			updateStats('tasksCount', true)
		}
		
		// Réinitialiser le formulaire (optionnel si vous fermez la modale)
		setTitle('');
		setDesc('');		setStart(new Date());
		setEnd(new Date());
		setColor(COLORS[0]);
		
		// Fermer la modale
		onClose && onClose();
	};

	if (!open) return null;
	
	return (
		<>
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
				<div className='bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fade-in'>
					<button
						className='absolute top-2 right-2 text-gray-500 hover:text-rose-600 text-2xl font-bold'
						onClick={onClose}
						aria-label={lang === 'fr' ? 'Fermer' : 'Close'}					>
						&times;
					</button>
					<h2 className='text-xl font-bold mb-4 text-gray-900'>
						{showDelete ? t('dashboard.tasks.edit', 'Modifier la tâche') : t('dashboard.tasks.create', 'Créer une tâche')}
					</h2>
					<form onSubmit={handleSubmit} className='flex flex-col gap-3'>
						<div className='flex flex-col gap-3'>
							<input
								type='text'
								placeholder={t('dashboard.tasks.title', 'Titre')}
								className='border rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={title}
								onChange={e => setTitle(e.target.value)}
								required
							/>
							<textarea
								placeholder={t('dashboard.tasks.description', 'Description')}
								className='border rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={desc}
								onChange={e => setDesc(e.target.value)}
							/>
							<div className='flex gap-2'>
								<input
									type='datetime-local'
									className='border rounded px-2 py-1 flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
									value={toLocalISOString(start)}
									onChange={e => setStart(new Date(e.target.value))}
									required
								/>
								<input
									type='datetime-local'
									className='border rounded px-2 py-1 flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
									value={toLocalISOString(end)}
									onChange={e => setEnd(new Date(e.target.value))}
									required
								/>
							</div>
							<div className='flex gap-2 items-center'>
								<span className='text-sm'>{t('dashboard.tasks.color', 'Couleur')}:</span>
								{COLORS.map(c => (
									<button
										key={c}
										type='button'
										className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-blue-600' : 'border-gray-200'}`}
										style={{ background: c }}
										onClick={() => setColor(c)}
										aria-label={t('dashboard.tasks.chooseColor', 'Choisir la couleur')}
									/>
								))}
							</div>
						</div>
						<div className='flex gap-2 justify-end mt-4'>
							{showDelete && (
								<button
									type='button'
									className='px-4 py-2 rounded bg-rose-700 text-white font-semibold'
									onClick={onDelete}
								>
									{t('dashboard.tasks.delete', 'Supprimer')}
								</button>
							)}
							<button
								type='button'
								className='px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold'
								onClick={onClose}
							>
								{t('dashboard.tasks.cancel', 'Annuler')}
							</button>
							<button
								type='submit'
								className='px-4 py-2 rounded bg-blue-700 text-white font-semibold'
							>
								{t('dashboard.tasks.save', 'Enregistrer')}
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Modal de limitation */}
			<PlanLimitModal				
			isOpen={showLimitModal}
				onClose={() => setShowLimitModal(false)}
				type="tasks"
				title={t('limits.tasks.maxReached') || 'Limite de tâches atteinte'}
				message={getLimitMessage('tasks')}
			/>
		</>
	)
}

export default AddTaskModal
