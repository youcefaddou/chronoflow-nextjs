'use client'

import { useState } from 'react'
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
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const timeManagementArticles = [
  {
    slug: '10-techniques-pomodoro-developpeurs',
    title: '10 Techniques de Pomodoro pour Développeurs',
    excerpt: 'Découvrez comment adapter la technique Pomodoro à votre workflow de développement pour maximiser votre concentration et productivité.',
    category: 'gestion-temps',
    readTime: '8 min',
    difficulty: 'Débutant',
    featured: true,
    image: '/assets/pomodoro-dev.jpg',
    tags: ['Pomodoro', 'Développement', 'Focus'],
    publishedAt: '2024-01-15'
  },
  {
    slug: 'methode-getting-things-done-freelances',
    title: 'Méthode Getting Things Done pour Freelances',
    excerpt: 'Implémentez le système GTD pour gérer efficacement vos projets clients et tâches personnelles en tant que freelance.',
    category: 'gestion-temps',
    readTime: '12 min',
    difficulty: 'Intermédiaire',
    featured: false,
    image: '/assets/gtd-freelance.jpg',
    tags: ['GTD', 'Freelance', 'Organisation'],
    publishedAt: '2024-01-10'
  },
  {
    slug: 'time-blocking-entrepreneurs',
    title: 'Time Blocking : Guide Complet pour Entrepreneurs',
    excerpt: 'Maîtrisez l\'art du time blocking pour structurer vos journées et atteindre vos objectifs business plus rapidement.',
    category: 'gestion-temps',
    readTime: '10 min',
    difficulty: 'Intermédiaire',
    featured: true,
    image: '/assets/time-blocking.jpg',
    tags: ['Time Blocking', 'Entrepreneuriat', 'Planning'],
    publishedAt: '2024-01-08'
  },
  {
    slug: 'matrice-eisenhower-priorites',
    title: 'Matrice d\'Eisenhower : Priorisez Comme un Pro',
    excerpt: 'Apprenez à utiliser la matrice d\'Eisenhower pour identifier et prioriser vos tâches les plus importantes.',
    category: 'gestion-temps',
    readTime: '6 min',
    difficulty: 'Débutant',
    featured: false,
    image: '/assets/eisenhower-matrix.jpg',
    tags: ['Priorisation', 'Productivité', 'Stratégie'],
    publishedAt: '2024-01-05'
  },
  {
    slug: 'deep-work-environnement-optimal',
    title: 'Deep Work : Créer l\'Environnement Optimal',
    excerpt: 'Découvrez comment créer les conditions parfaites pour entrer en état de deep work et accomplir un travail de qualité.',
    category: 'gestion-temps',
    readTime: '9 min',
    difficulty: 'Avancé',
    featured: false,
    image: '/assets/deep-work.jpg',
    tags: ['Deep Work', 'Focus', 'Environnement'],
    publishedAt: '2024-01-03'
  },
  {
    slug: 'gestion-interruptions-bureau',
    title: 'Gérer les Interruptions au Bureau',
    excerpt: 'Stratégies pratiques pour minimiser les interruptions et maintenir votre concentration en environnement de bureau.',
    category: 'gestion-temps',
    readTime: '7 min',
    difficulty: 'Intermédiaire',
    featured: false,
    image: '/assets/office-interruptions.jpg',
    tags: ['Interruptions', 'Bureau', 'Concentration'],
    publishedAt: '2024-01-01'
  },
  {
    slug: 'erreurs-productivite-freelances',
    title: '7 Erreurs de Productivité que Font Tous les Freelances',
    excerpt: 'Découvrez les pièges de productivité les plus courants chez les freelances et comment les éviter pour maximiser vos revenus et votre équilibre vie-travail.',
    category: 'gestion-temps',
    readTime: '11 min',
    difficulty: 'Intermédiaire',
    featured: true,
    image: '/assets/freelance-errors.jpg',
    tags: ['Freelance', 'Erreurs', 'Productivité', 'Tarifs'],
    publishedAt: '2025-05-22'
  }
]

export default function GestionTempsClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const filteredArticles = timeManagementArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty
    
    return matchesSearch && matchesDifficulty
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
              <Clock className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Gestion du Temps</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Timer className="h-4 w-4" />
              <span>Gestion du Temps</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Maîtrisez Votre
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Temps</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez les techniques les plus efficaces pour optimiser votre gestion du temps, 
              augmenter votre productivité et atteindre vos objectifs plus rapidement.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{timeManagementArticles.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Techniques éprouvées</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Résultats mesurables</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
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
              <h2 className="text-3xl font-bold text-gray-900">Articles Recommandés</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.slug}
                  href={`/ressources/${article.slug}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <Timer className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
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
            {searchTerm || selectedDifficulty !== 'all' ? 'Résultats de la recherche' : 'Tous les Articles'}
          </h2>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
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
                    <Clock className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
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
            Prêt à optimiser votre gestion du temps ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Commencez dès maintenant avec ChronoFlow et transformez votre productivité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Essayer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Découvrir ChronoFlow
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
