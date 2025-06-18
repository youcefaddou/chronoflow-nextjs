import Link from 'next/link'
import { 
  Calendar, 
  ArrowLeft,
  Settings,
  Target,
  Search,
  Filter,
  BookOpen,
  Star,
  TrendingUp,
  Zap,
  CheckCircle,
  Link as LinkIcon
} from 'lucide-react'
import { Suspense } from 'react'
import IntegrationsClient from './integrations-client'

// SEO metadata
export const metadata = {
  title: 'Intégrations | Ressources ChronoFlow - Connectez Vos Outils',
  description: 'Guides complets pour intégrer ChronoFlow avec vos outils préférés : Google Calendar, Slack, Trello, Asana et plus encore.',
  alternates: {
    canonical: 'https://chronoflow.xyz/ressources/categories/integrations'
  },
  openGraph: {
    title: 'Intégrations | Ressources ChronoFlow',
    description: 'Guides complets pour intégrer ChronoFlow avec vos outils préférés.',
    url: 'https://chronoflow.xyz/ressources/categories/integrations',
    siteName: 'ChronoFlow',
    locale: 'fr_FR',
    type: 'website',
    images: [{
      url: '/assets/og-integrations.jpg',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intégrations | Ressources ChronoFlow',
    description: 'Guides complets pour intégrer ChronoFlow avec vos outils préférés.',
    images: ['/assets/og-integrations.jpg'],
  }
}

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <IntegrationsClient />
      </Suspense>
    </div>
  )
}
