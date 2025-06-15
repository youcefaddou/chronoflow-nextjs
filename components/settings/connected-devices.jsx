'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function ConnectedDevices() {
	const { t, i18n } = useTranslation()
	const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
	const [devices, setDevices] = useState([])
	const [loading, setLoading] = useState(true)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const res = await fetch('/api/devices')
				const data = await res.json()
				setDevices(data)
			} catch {
				setDevices([])
			}
			setLoading(false)
		}
		fetchDevices()
	}, [])

	return (
		<div className='w-full'>
			<button
				type='button'
				className='flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition font-semibold'
				onClick={() => setOpen(v => !v)}
				aria-expanded={open}
			>
				<span>{t('settings.connectedDevices', 'Appareils connectés')}</span>
				<span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
			</button>
			{open && (
				<div className='mt-2'>
					{loading ? (
						<div className='text-gray-500'>{t('common.loading', 'Chargement...')}</div>
					) : devices.length === 0 ? (
						<div className='text-gray-500'>{t('settings.noDevices', 'Aucun appareil connecté.')}</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white rounded shadow'>
								<thead>
									<tr>
										<th className='px-4 py-2 text-left'>{t('settings.device', 'Appareil')}</th>
										<th className='px-4 py-2 text-left'>{t('settings.ip', 'IP')}</th>
										<th className='px-4 py-2 text-left'>{t('settings.browser', 'Navigateur')}</th>
										<th className='px-4 py-2 text-left'>{t('settings.connectedOn', 'Connecté le')}</th>
									</tr>
								</thead>
								<tbody>
									{devices.map(device => (
										<tr key={device._id} className='border-t'>
											<td className='px-4 py-2'>{device.device || t('common.unknown', 'Inconnu')}</td>
											<td className='px-4 py-2'>{device.ip || '-'}</td>
											<td className='px-4 py-2'>{device.browser || '-'}</td>
											<td className='px-4 py-2'>{device.createdAt ? new Date(device.createdAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') : '-'}</td>
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

export default ConnectedDevices
