'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

function FeaturesSection () {
	const { t } = useTranslation()

	const rootRef = useRef(null)

	useEffect(() => {
		// TODO: Réintégrer l'animation animejs plus tard
		// Pour l'instant, on révèle simplement les éléments
		const handleScroll = () => {
			if (!rootRef.current) return
			const rect = rootRef.current.getBoundingClientRect()
			const windowHeight = window.innerHeight || document.documentElement.clientHeight
			if (rect.top < windowHeight - 100) {
				const title = rootRef.current.querySelector('h2')
				const blocks = rootRef.current.querySelectorAll('.feature-block')
				
				if (title) title.style.opacity = '1'
				blocks.forEach((block, i) => {
					setTimeout(() => {
						block.style.opacity = '1'
						block.style.transform = 'translateY(0)'
					}, i * 200)
				})
				
				window.removeEventListener('scroll', handleScroll)
			}
		}
		window.addEventListener('scroll', handleScroll)
		handleScroll()
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<section ref={rootRef} className='py-12 bg-white'>
			<h2 className='text-4xl font-bold text-center mb-16 opacity-0 transition-opacity duration-1000'>{t('features.title')}</h2>
			<div className='max-w-4xl mx-auto grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 sm:gap-6 gap-12 gap-x-40'>
				<div className='flex flex-col items-center feature-block opacity-0 transform translate-y-8 transition-all duration-1000'>
					<video
						src='/assets/videos/chronometer.mp4'
						alt='ChronoFlow - Chronomètre'
						className='w-40 h-40 object-contain mb-2'
						autoPlay
						loop
						muted
						playsInline
					/>
					<h3 className='font-semibold mt-2'>{t('features.timerTitle')}</h3>
					<p className='text-gray-600 text-sm text-center'>{t('features.timerDesc')}</p>
				</div>
				<div className='flex flex-col items-center feature-block opacity-0 transform translate-y-8 transition-all duration-1000'>
					<img src='/assets/images/todo.gif' alt='todo list' className='w-40 h-40 object-contain mb-2' />
					<h3 className='font-semibold mt-2'>{t('features.tasksTitle')}</h3>
					<p className='text-gray-600 text-sm text-center'>{t('features.tasksDesc')}</p>
				</div>
				<div className='flex flex-col items-center feature-block opacity-0 transform translate-y-8 transition-all duration-1000'>
					<img src='/assets/images/calendar.gif' alt='google calendar' className='w-40 h-40 object-contain mb-2' />
					<h3 className='font-semibold mt-2'>{t('features.calendarTitle')}</h3>
					<p className='text-gray-600 text-sm text-center'>{t('features.calendarDesc')}</p>
				</div>
				<div className='flex flex-col items-center feature-block opacity-0 transform translate-y-8 transition-all duration-1000'>
					<img src='/assets/images/cadenas.gif' alt='cadenas' className='w-40 h-40 object-contain mb-2' />
					<h3 className='font-semibold mt-2'>{t('features.securityTitle')}</h3>
					<p className='text-gray-600 text-sm text-center'>{t('features.securityDesc')}</p>
				</div>
			</div>
		</section>
	)
}

export default FeaturesSection
