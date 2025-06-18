import Link from 'next/link'
import { 
  Clock, 
  ArrowLeft,
  Calendar,
  Target,
  Search,
  Filter,
  BookOpen,
  Star,
  TrendingUp,
  Timer,
  CheckCircle
} from 'lucide-react'
import { Suspense } from 'react'
import GestionTempsClient from './gestion-temps-client'

// SEO metadata
export const metadata = {
  title: {
    fr: 'Gestion du Temps | Ressources ChronoFlow - Techniques et Stratégies',
    en: 'Time Management | ChronoFlow Resources - Techniques and Strategies'
  },
  description: {
    fr: 'Découvrez les meilleures techniques de gestion du temps pour optimiser votre productivité. Guides pratiques, méthodes éprouvées et conseils d\'experts.',
    en: 'Discover the best time management techniques to optimize your productivity. Practical guides, proven methods and expert advice.'
  },
  alternates: {
    canonical: '/ressources/categories/gestion-temps',
    languages: {
      'fr': '/ressources/categories/gestion-temps',
      'en': '/en/resources/categories/time-management'
    }
  },
  openGraph: {
    title: 'Gestion du Temps | Ressources ChronoFlow',
    description: 'Découvrez les meilleures techniques de gestion du temps pour optimiser votre productivité.',
    url: '/ressources/categories/gestion-temps',
    siteName: 'ChronoFlow',
    locale: 'fr_FR',
    type: 'website',
    images: [{
      url: '/assets/og-time-management.jpg',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gestion du Temps | Ressources ChronoFlow',
    description: 'Découvrez les meilleures techniques de gestion du temps pour optimiser votre productivité.',
    images: ['/assets/og-time-management.jpg'],
  }
}

export default function GestionTempsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <GestionTempsClient />
      </Suspense>
    </div>
  )
}
