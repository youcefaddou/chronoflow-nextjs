'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function LoginHistory() {
	const { t, i18n } = useTranslation()
	const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
	const [history, setHistory] = useState([])
	const [loading, setLoading] = useState(true)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await fetch('/api/login-history')
				const data = await res.json()
				setHistory(data)
			} catch {
				setHistory([])
			}
			setLoading(false)
		}
		fetchHistory()
	}, [])

	return (
		<div className='w-full'>
			<button
				type='button'
				className='flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition font-semibold'
				onClick={() => setOpen(v => !v)}
				aria-expanded={open}
			>
				<span>{t('settings.loginHistory', 'Historique des connexions')}</span>
				<span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
			</button>
			{open && (
				<div className='mt-2'>
					{loading ? (
						<div className='text-gray-500'>{t('common.loading', 'Chargement...')}</div>
					) : history.length === 0 ? (
						<div className='text-gray-500'>{t('settings.noRecentLogins', 'Aucune connexion récente.')}</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white rounded shadow'>
								<thead>
									<tr>
										<th className='px-4 py-2 text-left'>{t('settings.date', 'Date')}</th>
										<th className='px-4 py-2 text-left'>{t('settings.ip', 'IP')}</th>
										<th className='px-4 py-2 text-left'>{t('settings.device', 'Appareil')}</th>
										<th className='px-4 py-2 text-left'>{t('settings.status', 'Statut')}</th>
									</tr>
								</thead>
								<tbody>
									{history.map(log => (
										<tr key={log._id} className='border-t'>
											<td className='px-4 py-2'>{log.date ? new Date(log.date).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') : '-'}</td>
											<td className='px-4 py-2'>{log.ip || '-'}</td>
											<td className='px-4 py-2'>{log.device || '-'}</td>
											<td className={`px-4 py-2 ${log.success ? 'text-green-600' : 'text-red-600'}`}>
												{log.success ? t('settings.success', 'Succès') : t('settings.failure', 'Échec')}
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
