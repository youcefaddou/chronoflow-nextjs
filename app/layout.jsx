import './globals.css'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import I18nProvider from '../components/i18n-provider'
import { AuthProvider } from '../contexts/auth-context'
import { Toaster } from 'react-hot-toast'

export const metadata = {
	title: 'ChronoFlow - Gestion du Temps et Productivité',
	description: 'Optimisez votre productivité avec ChronoFlow. Suivi du temps, gestion des tâches, et synchronisation Google Calendar.',
}

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body className="antialiased">
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
