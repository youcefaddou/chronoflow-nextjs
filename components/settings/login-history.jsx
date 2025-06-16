'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, AlertTriangle } from 'lucide-react'

function LoginHistory() {
	const { t, i18n } = useTranslation()
	const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
	const [history, setHistory] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await fetch('/api/login-history')
				
				if (!res.ok) {
					if (res.status === 401) {
						setError('Non autorisé')
					} else {
						setError('Erreur lors du chargement de l\'historique')
					}
					setHistory([])
					return
				}
				
				const data = await res.json()
				setHistory(Array.isArray(data) ? data : [])
				setError('')
			} catch (fetchError) {
				console.error('Error fetching login history:', fetchError)
				setError('Erreur de connexion')
				setHistory([])
			}
			setLoading(false)
		}
		
		if (open) {
			fetchHistory()
		}
	}, [open])

	// Fonction pour formater la date de manière plus lisible
	const formatDate = (dateString) => {
		if (!dateString) return '-'
		
		const date = new Date(dateString)
		const now = new Date()
		const diffTime = Math.abs(now - date)
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		
		// Si c'est aujourd'hui
		if (diffDays === 1) {
			return `${t('common.today', 'Aujourd\'hui')} ${date.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`
		}
		
		// Si c'est hier
		if (diffDays === 2) {
			return `${t('common.yesterday', 'Hier')} ${date.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`
		}
		
		// Sinon, date complète
		return date.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className='w-full'>
			<button
				type='button'
				className='flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition font-semibold'
				onClick={() => setOpen(v => !v)}
				aria-expanded={open}
			>
				<div className="flex items-center gap-2">
					<Shield className="h-4 w-4 text-blue-600" />
					<span>{t('settings.loginHistory', 'Historique des connexions')}</span>
				</div>
				<span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
			</button>
			{open && (
				<div className='mt-2'>
					{loading ? (
						<div className='flex items-center gap-2 text-gray-500 p-4'>
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<span>{t('common.loading', 'Chargement...')}</span>
						</div>
					) : error ? (
						<div className='flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded border border-red-200'>
							<AlertTriangle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					) : history.length === 0 ? (
						<div className='text-gray-500 p-4 text-center bg-gray-50 rounded border'>
							{t('settings.noRecentLogins', 'Aucune connexion récente. Votre historique de connexions apparaîtra ici après votre première connexion.')}
						</div>
					) : (
						<div className='overflow-x-auto border border-gray-200 rounded'>
							<table className='min-w-full bg-white'>
								<thead className="bg-gray-50">
									<tr>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>{t('settings.date', 'Date')}</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>{t('settings.ip', 'Adresse IP')}</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>{t('settings.device', 'Appareil')}</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>{t('settings.status', 'Statut')}</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{history.map((log, index) => (
										<tr key={log._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
											<td className='px-4 py-3 text-sm text-gray-900'>{formatDate(log.date)}</td>
											<td className='px-4 py-3 text-sm text-gray-600 font-mono'>{log.ip || '-'}</td>
											<td className='px-4 py-3 text-sm text-gray-600'>{log.device || '-'}</td>
											<td className='px-4 py-3 text-sm'>
												{log.success ? (
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
														{t('settings.success', 'Succès')}
													</span>
												) : (
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
														{t('settings.failure', 'Échec')}
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default LoginHistory
