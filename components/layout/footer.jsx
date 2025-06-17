'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import './footer.css'

export default function Footer() {
	const { t } = useTranslation()
	const year = new Date().getFullYear()
	return (
		<footer className="footer-main w-full bg-gradient-to-r from-gray-50 to-blue-50 border-t border-blue-100/50 mt-8 relative overflow-hidden">
			{/* Particules de fond subtiles */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
			</div>
			
			<div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-10 relative z-10">
				<div className="flex flex-col sm:flex-row sm:gap-10 md:gap-0">
					<div className="flex flex-col gap-3 sm:w-1/2 md:w-1/3 mb-8 sm:mb-0 items-center sm:items-start text-center sm:text-left">
						<span className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight hover:scale-105 transition-transform duration-300">
							ChronoFlow
						</span>
						<div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							© {year} {t('footer.rights')}
						</div>
					</div>					<div className="flex flex-col sm:flex-row flex-1 gap-8">
						<ul className="footer-list flex flex-col gap-3 min-w-[120px] sm:w-1/2 md:w-1/3 items-center sm:items-start text-center sm:text-left">
							<li className="font-semibold text-gray-800 mb-2 text-base">{t('footer.product')}</li>
							<li>
								<Link href="/product" className="footer-link group">
									<span className="relative">
										{t('footer.product')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
							<li>
								<Link href="/pricing" className="footer-link group">
									<span className="relative">
										{t('footer.pricing')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
							<li>
								<Link href="/resources" className="footer-link group">
									<span className="relative">
										{t('footer.resources')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
						</ul>
						<ul className="footer-list flex flex-col gap-3 min-w-[120px] sm:w-1/2 md:w-1/3 items-center sm:items-start text-center sm:text-left">
							<li className="font-semibold text-gray-800 mb-2 text-base">{t('footer.help')}</li>
							<li>
								<Link href="/faq" className="footer-link group">
									<span className="relative">
										{t('footer.faq')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
							<li>
								<Link href="/contact" className="footer-link group">
									<span className="relative">
										{t('footer.contact')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
						</ul>
						<ul className="footer-list flex flex-col gap-3 min-w-[120px] sm:w-1/2 md:w-1/3 items-center sm:items-start text-center sm:text-left">
							<li className="font-semibold text-gray-800 mb-2 text-base">{t('footer.legal')}</li>
							<li>
								<Link href="/legal-notice" className="footer-link group">
									<span className="relative">
										{t('footer.legalNotice')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
							<li>
								<Link href="/privacy-policy" className="footer-link group">
									<span className="relative">
										{t('footer.privacyPolicy')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>							</li>
							<li>
								<Link href="/terms" className="footer-link group">
									<span className="relative">
										{t('footer.terms')}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
									</span>
								</Link>
							</li>
						</ul>
					</div>
				</div>
				
				{/* Barre de séparation avec gradient */}
				<div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
				
				{/* Section supplémentaire avec stats ou CTA */}
				<div className="text-center">
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span>Temps de réponse: &lt;24h</span>
						</div>
						<div className="hidden sm:block w-px h-4 bg-gray-300"></div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
							<span>99.9% de disponibilité</span>
						</div>
						<div className="hidden sm:block w-px h-4 bg-gray-300"></div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
							<span>Données sécurisées</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
