import './globals.css'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import I18nProvider from '../components/i18n-provider'
import { AuthProvider } from '../contexts/auth-context'
import { Toaster } from 'react-hot-toast'

export const metadata = {
	title: 'ChronoFlow - Logiciel de Suivi du Temps pour Freelances et PME',
	description: 'Optimisez votre productivité avec ChronoFlow, le logiciel de time tracking le plus simple. Chronométrez vos projets, synchronisez votre calendrier et boostez vos revenus. Essai gratuit.',
	keywords: [
		'suivi du temps',
		'time tracking',
		'freelance',
		'PME',
		'productivité',
		'chronométrage',
		'gestion de projet',
		'facturation',
		'Google Calendar',
		'rapports',
		'ChronoFlow'
	],
	authors: [{ name: 'ChronoFlow Team' }],
	creator: 'ChronoFlow',
	publisher: 'ChronoFlow',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chronoflow.app'),
	alternates: {
		canonical: '/',
		languages: {
			'fr': '/',
			'en': '/en',
		},
	},
	openGraph: {
		title: 'ChronoFlow - Le Time Tracking Simplifié',
		description: 'Logiciel de suivi du temps pensé pour les freelances et PME. Interface intuitive, synchronisation calendrier, rapports détaillés. Essai gratuit.',
		url: '/',
		siteName: 'ChronoFlow',
		images: [
			{
				url: '/assets/images/og/home-og.jpg',
				width: 1200,
				height: 630,
				alt: 'ChronoFlow - Interface de suivi du temps moderne',
			},
		],
		locale: 'fr_FR',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ChronoFlow - Time Tracking Simplifié',
		description: 'Optimisez votre temps et vos revenus avec notre logiciel de suivi intuitive. Essai gratuit pour freelances et PME.',
		images: ['/assets/images/og/home-twitter.jpg'],
		creator: '@chronoflow',
	},
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
}

export default function RootLayout({ children }) {

	return (
		<html lang="fr">
			<body className="antialiased" suppressHydrationWarning={true}>
				<I18nProvider>
					<AuthProvider>
						<div className="min-h-screen flex flex-col">
							<Header />
							<main className="flex-1">
								{children}
							</main>
							<Footer />
						</div>
						<Toaster />
					</AuthProvider>
				</I18nProvider>
			</body>
		</html>
	)
}
