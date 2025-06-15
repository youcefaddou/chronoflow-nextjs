'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import './hero-section.css'

function HeroSection() {
	const { t } = useTranslation()

	return (
		<section className="py-6 px-4 sm:py-16 sm:px-6 md:py-12 md:px-8 text-center bg-white">
			<h1
				className="hero-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-rose-800 mb-12 leading-tight"
			>
				{t('hero.title')}
			</h1>
			<p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 mt-6 max-w-2xl mx-auto">
				{t('hero.subtitle')}
			</p>
			<Link
				href="/signup"
				className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3 mt-8 rounded-lg shadow transition"
			>
				{t('hero.cta')}
			</Link>
		</section>
	)
}

export default HeroSection
