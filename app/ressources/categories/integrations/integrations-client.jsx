'use client'

import { useState } from 'react'
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
  Link as LinkIcon,
  ArrowRight
} from 'lucide-react'

const integrationArticles = [
  {
    slug: 'integration-google-calendar-chronoflow',
    title: 'Intégrer Google Calendar avec ChronoFlow',
    excerpt: 'Synchronisez parfaitement vos événements Google Calendar avec ChronoFlow pour un suivi automatique du temps et une meilleure planification.',
    category: 'integrations',
    readTime: '12 min',
    difficulty: 'Intermédiaire',
    featured: true,
    image: '/assets/google-calendar-integration.jpg',
    tags: ['Google Calendar', 'Synchronisation', 'Automatisation'],
    publishedAt: '2024-01-20',
    integration: 'Google Calendar'
  },
  {
    slug: 'slack-notifications-chronoflow',
    title: 'Notifications Slack pour ChronoFlow',
    excerpt: 'Configurez des notifications intelligentes dans Slack pour suivre vos objectifs de temps et rester motivé avec votre équipe.',
    category: 'integrations',
    readTime: '8 min',
    difficulty: 'Débutant',
    featured: true,
    image: '/assets/slack-integration.jpg',
    tags: ['Slack', 'Notifications', 'Équipe'],
    publishedAt: '2024-01-18',
    integration: 'Slack'
  },
  {
    slug: 'trello-time-tracking-automatique',
    title: 'Time Tracking Automatique avec Trello',
    excerpt: 'Découvrez comment automatiser le suivi du temps sur vos cartes Trello grâce à l\'intégration ChronoFlow.',
    category: 'integrations',
    readTime: '10 min',
    difficulty: 'Intermédiaire',
    featured: false,
    image: '/assets/trello-integration.jpg',
    tags: ['Trello', 'Automatisation', 'Gestion de projet'],
    publishedAt: '2024-01-15',
    integration: 'Trello'
  },
  {
    slug: 'asana-synchronisation-taches',
    title: 'Synchronisation des Tâches Asana',
    excerpt: 'Synchronisez vos projets Asana avec ChronoFlow pour un suivi précis du temps passé sur chaque tâche et une meilleure estimation.',
    category: 'integrations',
    readTime: '11 min',
    difficulty: 'Avancé',
    featured: false,
    image: '/assets/asana-integration.jpg',
    tags: ['Asana', 'Synchronisation', 'Estimation'],
    publishedAt: '2024-01-12',
    integration: 'Asana'
  },
  {
    slug: 'notion-dashboard-productivite',
    title: 'Dashboard Productivité avec Notion',
    excerpt: 'Créez un dashboard personnalisé dans Notion en connectant vos données ChronoFlow pour une vue d\'ensemble de votre productivité.',
    category: 'integrations',
    readTime: '15 min',
    difficulty: 'Avancé',
    featured: true,
    image: '/assets/notion-integration.jpg',
    tags: ['Notion', 'Dashboard', 'Analytics'],
    publishedAt: '2024-01-10',
    integration: 'Notion'
  },
  {
    slug: 'github-suivi-temps-developpement',
    title: 'Suivi du Temps de Développement GitHub',
    excerpt: 'Intégrez ChronoFlow avec GitHub pour tracker automatiquement le temps passé sur vos commits, pull requests et issues.',
    category: 'integrations',
    readTime: '9 min',
    difficulty: 'Intermédiaire',
    featured: false,
    image: '/assets/github-integration.jpg',
    tags: ['GitHub', 'Développement', 'Commits'],
    publishedAt: '2024-01-08',
    integration: 'GitHub'
  }
]

const integrationPlatforms = [
  { name: 'Google Calendar', count: 1, color: 'bg-blue-100 text-blue-800' },
  { name: 'Slack', count: 1, color: 'bg-purple-100 text-purple-800' },
  { name: 'Trello', count: 1, color: 'bg-green-100 text-green-800' },
  { name: 'Asana', count: 1, color: 'bg-orange-100 text-orange-800' },
  { name: 'Notion', count: 1, color: 'bg-gray-100 text-gray-800' },
  { name: 'GitHub', count: 1, color: 'bg-indigo-100 text-indigo-800' }
]

export default function IntegrationsClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const filteredArticles = integrationArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty
    const matchesPlatform = selectedPlatform === 'all' || article.integration === selectedPlatform
    
    return matchesSearch && matchesDifficulty && matchesPlatform
  })

  const featuredArticles = filteredArticles.filter(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Avancé': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ressources" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Retour aux ressources</span>
            </Link>
            <div className="flex items-center gap-4">
              <LinkIcon className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Intégrations</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <LinkIcon className="h-4 w-4" />
              <span>Intégrations</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connectez Vos
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Outils</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Intégrez ChronoFlow avec vos applications préférées pour automatiser votre workflow 
              et synchroniser parfaitement tous vos outils de productivité.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{integrationArticles.length} guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>6 plateformes</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Automatisation complète</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Platforms */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {integrationPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => setSelectedPlatform(selectedPlatform === platform.name ? 'all' : platform.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPlatform === platform.name 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : `${platform.color} hover:shadow-sm`
                }`}
              >
                {platform.name} ({platform.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une intégration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les niveaux</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Intégrations Populaires</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.slug}
                  href={`/ressources/${article.slug}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
                    <LinkIcon className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </div>
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {article.integration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.publishedAt}</span>
                      <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            {searchTerm || selectedDifficulty !== 'all' || selectedPlatform !== 'all' ? 'Résultats de la recherche' : 'Tous les Guides'}
          </h2>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune intégration trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link 
                  key={article.slug}
                  href={`/ressources/${article.slug}`}
                  className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                    <Settings className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </div>
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {article.integration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.publishedAt}</span>
                      <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à connecter vos outils ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Commencez dès maintenant avec ChronoFlow et créez votre écosystème de productivité parfait.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Commencer les intégrations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Voir toutes les intégrations
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
