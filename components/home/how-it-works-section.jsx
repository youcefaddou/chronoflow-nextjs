'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

function HowItWorksSection () {
	const { t } = useTranslation()

	const steps = [
		{
			icon: '▶️',
			title: t('howitworks.step1Title'),
			desc: t('howitworks.step1Desc'),
		},
		{
			icon: '➕',
			title: t('howitworks.step2Title'),
			desc: t('howitworks.step2Desc'),
		},
		{
			icon: '📈',
			title: t('howitworks.step3Title'),
			desc: t('howitworks.step3Desc'),
		},
	]

	const rootRef = useRef(null)
	useEffect(() => {
		const handleScroll = () => {
			if (!rootRef.current) return
			const rect = rootRef.current.getBoundingClientRect()
			const windowHeight = window.innerHeight || document.documentElement.clientHeight
			
			// Si la section est visible ou presque visible
			if (rect.top < windowHeight - 50) {
				const title = rootRef.current.querySelector('h2')
				const stepsElements = rootRef.current.querySelectorAll('.how-it-works-step')
				
				// Animer le titre
				if (title && title.style.opacity !== '1') {
					title.style.opacity = '1'
				}
				
				// Animer les étapes avec un délai
				stepsElements.forEach((step, i) => {
					if (step.style.opacity !== '1') {
						setTimeout(() => {
							step.style.opacity = '1'
							step.style.transform = 'translateY(0)'
						}, i * 150)
					}
				})
				
				// Supprimer l'écouteur une fois l'animation déclenchée
				window.removeEventListener('scroll', handleScroll)
			}
		}
		
		// Déclencher immédiatement si déjà visible
		const triggerAnimation = () => {
			setTimeout(handleScroll, 100)
		}
		
		window.addEventListener('scroll', handleScroll)
		triggerAnimation() // Déclencher au montage
		
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])
	return (
		<section ref={rootRef} className='py-16 bg-white'>
			<h2 className="text-4xl font-bold text-center mb-15 opacity-0 transition-opacity duration-1000">
				{t('howitworks.title')}
			</h2>
			<div className="max-w-3xl mx-auto mt-10 flex flex-col md:flex-row justify-center items-center gap-8">
				{steps.map((step, i) => (
					<div
						key={step.title}
						className="flex flex-col items-center how-it-works-step opacity-0 transform translate-y-8 transition-all duration-1000"
					>
						<span className="text-rose-600 text-4xl mb-2">{step.icon}</span>
						<h3 className="font-semibold">{step.title}</h3>
						<p className="text-gray-600 text-sm text-center">{step.desc}</p>
					</div>
				))}
			</div>
		</section>
	)
}

export default HowItWorksSection
