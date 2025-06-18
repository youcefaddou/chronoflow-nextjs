import { Suspense } from 'react'
import ResourcesClient from './resources-client'

export const metadata = {
    title: 'Ressources Productivité | Guides Time Tracking & Gestion Temps | ChronoFlow',
    description: 'Découvrez nos guides experts en productivité, techniques Pomodoro, time tracking et gestion du temps. Articles gratuits pour freelances et entrepreneurs.',
    keywords: 'productivité, time tracking, gestion temps, Pomodoro, freelance, entrepreneur, suivi temps, guides gratuits',    
    alternates: {
        canonical: 'https://chronoflow.xyz/ressources'
    },
    openGraph: {
        title: 'Centre de Ressources ChronoFlow | Guides Productivité & Time Tracking',
        description: 'Guides pratiques, techniques avancées et stratégies éprouvées pour optimiser votre gestion du temps et booster votre efficacité.',
        type: 'website',        
        locale: 'fr_FR',
        siteName: 'ChronoFlow'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ressources Productivité ChronoFlow',
        description: 'Guides experts pour maîtriser votre productivité et optimiser votre gestion du temps.'
    }
}

export default function RessourcesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des ressources...</p>
                </div>
            </div>
        }>
            <ResourcesClient />
        </Suspense>
    )
}
