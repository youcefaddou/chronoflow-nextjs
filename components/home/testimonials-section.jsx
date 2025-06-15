'use client'

import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function TestimonialsSection() {
	const { t } = useTranslation()

	const sectionRef = useRef(null)
	const containerRefs = useRef([])

	const testimonials = [
		{
			text: t('home.testimonials.testimonial1.text'),
			name: t('home.testimonials.testimonial1.name'),
		},
		{
			text: t('home.testimonials.testimonial2.text'),
			name: t('home.testimonials.testimonial2.name'),
		},
		{
			text: t('home.testimonials.testimonial3.text'),
			name: t('home.testimonials.testimonial3.name'),
		},
	]
	useEffect(() => {
		let hasAnimated = false

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !hasAnimated) {
				hasAnimated = true
				animateTestimonials()
			}
		}, { threshold: 0.3 })

		const animateTestimonials = () => {
			// Récupérer tous les containers valides
			const containers = containerRefs.current.filter(el => el)
			
			containers.forEach((container, index) => {
				// Animation simple avec CSS transitions
				setTimeout(() => {
					container.classList.add('animate-in')
					
					// Animer les étoiles
					const stars = container.querySelectorAll('.testimonial-star')
					stars.forEach((star, starIndex) => {
						setTimeout(() => {
							star.classList.add('star-animate')
						}, starIndex * 100)
					})
				}, index * 250)
			})
		}

		if (sectionRef.current) {
			observer.observe(sectionRef.current)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<section ref={sectionRef} className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
					{t('home.testimonials.title')}
				</h2>
						<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							ref={el => (containerRefs.current[index] = el)}
							className="testimonial-card bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 opacity-0 -translate-x-24"
						>
							{/* Étoiles */}
							<div className="flex justify-center mb-4 space-x-1">
								{[...Array(5)].map((_, starIndex) => (
									<span
										key={starIndex}
										className="testimonial-star text-2xl text-yellow-400 transition-all duration-300 opacity-0 scale-[0.3] inline-block"
									>
										⭐
									</span>
								))}
							</div>
							<p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
								{testimonial.text}
							</p>
							<div className="text-gray-500 font-medium">
								{testimonial.name}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default TestimonialsSection
