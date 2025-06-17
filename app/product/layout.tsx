import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ChronoFlow - Logiciel de Suivi du Temps pour Freelances et PME | Chronomètre Productivité',
  description: 'Découvrez ChronoFlow, le logiciel de suivi du temps le plus simple pour freelances et PME. Chronométrez vos projets, synchronisez Google Calendar et boostez votre productivité de +40%.',
  keywords: 'logiciel suivi temps, chronomètre productivité, gestion temps freelance, suivi tâches PME, synchronisation google calendar, facturation temps passé, outil productivité',
  openGraph: {
    title: 'ChronoFlow - Le Suivi du Temps Simplifié pour Professionnels',
    description: 'Augmentez votre productivité de +40% avec ChronoFlow. Interface simple, synchronisation calendar, rapports détaillés. Essai gratuit.',
    type: 'website',
    url: 'https://chronoflow.com/product',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChronoFlow - Le Suivi du Temps Simplifié pour Professionnels',
    description: 'Augmentez votre productivité de +40% avec ChronoFlow. Interface simple, synchronisation calendar, rapports détaillés. Essai gratuit.',
  },
  alternates: {
    canonical: 'https://chronoflow.com/product',
  },
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
