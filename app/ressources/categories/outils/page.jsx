import Link from 'next/link'
import { 
  Wrench, 
  ArrowLeft,
  Target,
  Search,
  Filter,
  BookOpen,
  Star,
  TrendingUp,
  Zap,
  CheckCircle,
  BarChart3,
  Users,
  Clock
} from 'lucide-react'
import { Suspense } from 'react'
import OutilsClient from './outils-client'

// SEO metadata
export const metadata = {
  title: 'Outils Recommandés | Ressources ChronoFlow - Stack Productivité',
  description: 'Découvrez les meilleurs outils de productivité recommandés par ChronoFlow. Comparatifs, tests et guides pour optimiser votre workflow.',
  alternates: {
    canonical: 'https://chronoflow.xyz/ressources/categories/outils'
  },
  openGraph: {
    title: 'Outils Recommandés | Ressources ChronoFlow',
    description: 'Découvrez les meilleurs outils de productivité recommandés par ChronoFlow.',
    url: 'https://chronoflow.xyz/ressources/categories/outils',
    siteName: 'ChronoFlow',
    locale: 'fr_FR',
    type: 'website',
    images: [{
      url: '/assets/og-tools.jpg',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outils Recommandés | Ressources ChronoFlow',
    description: 'Découvrez les meilleurs outils de productivité recommandés par ChronoFlow.',
    images: ['/assets/og-tools.jpg'],
  }
}

export default function OutilsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <OutilsClient />
      </Suspense>
    </div>
  )
}
