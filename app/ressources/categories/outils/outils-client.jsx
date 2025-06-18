'use client'

import { useState } from 'react'
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
  Clock,
  ArrowRight
} from 'lucide-react'

const toolsArticles = [
  {
    slug: 'meilleurs-outils-suivi-temps-2024',
    title: 'Top 10 des Meilleurs Outils de Suivi du Temps 2024',
    excerpt: 'Comparatif exhaustif des meilleures applications de time tracking pour freelances, équipes et entreprises en 2024.',
    category: 'outils',
    readTime: '15 min',
    difficulty: 'Débutant',
    featured: true,
    image: '/assets/time-tracking-tools.jpg',
    tags: ['Comparatif', 'Time Tracking', 'Outils'],
    publishedAt: '2024-01-25',
    toolType: 'Time Tracking'
  },
  {
    slug: 'outils-gestion-projet-freelances',
    title: 'Meilleurs Outils de Gestion de Projet pour Freelances',
    excerpt: 'Découvrez les plateformes les plus efficaces pour organiser vos projets clients et collaborer avec vos équipes.',
    category: 'outils',
    readTime: '12 min',
    difficulty: 'Intermédiaire',
    featured: true,
    image: '/assets/project-management-tools.jpg',
    tags: ['Gestion de projet', 'Freelance', 'Collaboration'],
    publishedAt: '2024-01-22',
    toolType: 'Gestion de Projet'
  },
  {
    slug: 'applications-focus-concentration',
    title: 'Applications de Focus et Concentration',
    excerpt: 'Les meilleures apps pour éliminer les distractions et maintenir votre concentration pendant vos sessions de travail.',
    category: 'outils',
    readTime: '8 min',
    difficulty: 'Débutant',
    featured: false,
    image: '/assets/focus-apps.jpg',
    tags: ['Focus', 'Concentration', 'Applications'],
    publishedAt: '2024-01-20',
    toolType: 'Focus'
  },
  {
    slug: 'outils-analyse-productivite',
    title: 'Outils d\'Analyse de Productivité',
    excerpt: 'Analysez vos patterns de travail avec les meilleurs outils de mesure et d\'optimisation de la productivité.',
    category: 'outils',
    readTime: '10 min',
    difficulty: 'Avancé',
    featured: true,
    image: '/assets/productivity-analytics.jpg',
    tags: ['Analytics', 'Productivité', 'Mesure'],
    publishedAt: '2024-01-18',
    toolType: 'Analytics'
  },
  {
    slug: 'extensions-navigateur-productivite',
    title: 'Extensions Navigateur pour la Productivité',
    excerpt: 'Collection des meilleures extensions Chrome, Firefox et Edge pour booster votre productivité en ligne.',
    category: 'outils',
    readTime: '9 min',
    difficulty: 'Débutant',
    featured: false,
    image: '/assets/browser-extensions.jpg',
    tags: ['Extensions', 'Navigateur', 'Web'],
    publishedAt: '2024-01-15',
    toolType: 'Extensions'
  },
  {
    slug: 'applications-prise-notes-optimale',
    title: 'Applications de Prise de Notes Optimale',
    excerpt: 'Notion, Obsidian, Roam Research : comparatif des meilleures solutions pour organiser vos connaissances.',
    category: 'outils',
    readTime: '11 min',
    difficulty: 'Intermédiaire',
    featured: false,
    image: '/assets/note-taking-apps.jpg',
    tags: ['Notes', 'Organisation', 'Connaissances'],
    publishedAt: '2024-01-12',
    toolType: 'Prise de Notes'
  },
  {
    slug: 'outils-automatisation-workflow',
    title: 'Outils d\'Automatisation de Workflow',
    excerpt: 'Zapier, Make, IFTTT : automatisez vos tâches répétitives et optimisez votre flux de travail.',
    category: 'outils',
    readTime: '13 min',
    difficulty: 'Avancé',
    featured: false,
    image: '/assets/automation-tools.jpg',
    tags: ['Automatisation', 'Workflow', 'Efficacité'],
    publishedAt: '2024-01-10',
    toolType: 'Automatisation'
  }
]

const toolCategories = [
  { name: 'Time Tracking', count: 1, color: 'bg-blue-100 text-blue-800' },
  { name: 'Gestion de Projet', count: 1, color: 'bg-green-100 text-green-800' },
  { name: 'Focus', count: 1, color: 'bg-purple-100 text-purple-800' },
  { name: 'Analytics', count: 1, color: 'bg-orange-100 text-orange-800' },
  { name: 'Extensions', count: 1, color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Prise de Notes', count: 1, color: 'bg-teal-100 text-teal-800' },
  { name: 'Automatisation', count: 1, color: 'bg-red-100 text-red-800' }
]

export default function OutilsClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = toolsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty
    const matchesCategory = selectedCategory === 'all' || article.toolType === selectedCategory
    
    return matchesSearch && matchesDifficulty && matchesCategory
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
              <Wrench className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Outils</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Wrench className="h-4 w-4" />
              <span>Outils Recommandés</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Stack
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Productivité</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez les meilleurs outils testés et approuvés par l'équipe ChronoFlow pour 
              construire votre stack de productivité idéale et optimiser votre workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{toolsArticles.length} comparatifs</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Tests approfondis</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Recommandations expertes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-800 hover:shadow-sm'
              }`}
            >
              Tous les outils
            </button>
            {toolCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? 'all' : category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.name 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : `${category.color} hover:shadow-sm`
                }`}
              >
                {category.name} ({category.count})
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
                placeholder="Rechercher un outil..."
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
              <h2 className="text-3xl font-bold text-gray-900">Outils Recommandés</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.slug}
                  href={`/ressources/${article.slug}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <Wrench className="h-12 w-12 text-blue-600" />
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
                        {article.toolType}
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
            {searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all' ? 'Résultats de la recherche' : 'Tous les Comparatifs'}
          </h2>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun outil trouvé</h3>
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
                    <BarChart3 className="h-10 w-10 text-gray-400" />
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
                        {article.toolType}
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
            Prêt à optimiser votre stack ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Commencez avec ChronoFlow, l'outil central de votre écosystème de productivité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Essayer ChronoFlow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Voir toutes les fonctionnalités
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
