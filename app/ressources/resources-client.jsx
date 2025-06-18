'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Clock,
    Zap,
    Calendar,
    BarChart3,
    Users,
    Target,
    Search,
    Filter,
    ArrowRight,
    BookOpen,
    Star,
    TrendingUp
} from 'lucide-react'

const categories = [
    {
        id: 'productivite',
        name: 'Productivité',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        description: 'Techniques et méthodes pour maximiser votre efficacité'
    },
    {
        id: 'gestion-temps',
        name: 'Gestion du Temps',
        icon: Clock,
        color: 'from-blue-500 to-cyan-500',
        description: 'Maîtrisez l\'art de la planification et de l\'organisation'
    },
    {
        id: 'integrations',
        name: 'Intégrations',
        icon: Calendar,
        color: 'from-green-500 to-emerald-500',
        description: 'Connectez vos outils pour un workflow optimal'
    },
    {
        id: 'outils',
        name: 'Guides Outils',
        icon: BarChart3,
        color: 'from-purple-500 to-indigo-500',
        description: 'Comparatifs et guides d\'utilisation des meilleurs outils'
    }
]

const featuredArticles = [
    {
        id: 'pomodoro-developpeurs',
        title: '10 Techniques de Pomodoro pour Développeurs',
        excerpt: 'Découvrez comment adapter la technique Pomodoro aux spécificités du développement logiciel pour maximiser votre concentration.',
        category: 'productivite',
        readTime: '8 min',
        featured: true,
        image: '/assets/articles/pomodoro-dev.jpg'
    },
    {
        id: 'choisir-outil-suivi-temps-2024',
        title: 'Guide Complet: Choisir le Meilleur Outil de Suivi du Temps en 2024',
        excerpt: 'Comparatif détaillé des 15 meilleurs outils de time tracking avec analyse des fonctionnalités, prix et cas d\'usage.',
        category: 'outils',
        readTime: '12 min',
        featured: true,
        image: '/assets/articles/comparatif-outils.jpg'
    },
    {
        id: 'freelances-doubler-productivite',
        title: 'Comment les Freelances Peuvent Doubler Leur Productivité',
        excerpt: 'Stratégies concrètes et outils recommandés pour maximiser votre efficacité en tant que freelance et augmenter vos revenus.',
        category: 'productivite',
        readTime: '10 min',
        featured: true,
        image: '/assets/articles/productivite-freelance.jpg'
    }
]

const allArticles = [
    ...featuredArticles,
    {
        id: 'integration-google-calendar',
        title: 'Intégration Google Calendar : Révolutionner Votre Gestion du Temps',
        excerpt: 'Guide complet pour synchroniser parfaitement ChronoFlow avec Google Calendar et optimiser votre planification.',
        category: 'integrations',
        readTime: '15 min',
        featured: false
    },
    {
        id: 'erreurs-productivite-freelances',
        title: '5 Erreurs qui Ruinent la Productivité des Freelances',
        excerpt: 'Identifiez et corrigez les erreurs les plus communes qui sabotent votre efficacité et vos revenus.',
        category: 'productivite',
        readTime: '7 min',
        featured: false
    },
    {
        id: 'roi-time-tracking',
        title: 'ROI du Time Tracking: Étude de Cas Réels',
        excerpt: 'Analyses détaillées de 5 cas concrets montrant l\'impact financier mesurable du suivi du temps en entreprise.',
        category: 'gestion-temps',
        readTime: '11 min',
        featured: false
    }
]

export default function ResourcesClient() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const featuredOnly = filteredArticles.filter(article => article.featured)
    const regularArticles = filteredArticles.filter(article => !article.featured)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="py-16 px-4 text-center">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-8">
                        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Centre de Ressources ChronoFlow
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Maîtrisez Votre <span className="text-blue-600">Productivité</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            Guides pratiques, techniques avancées et stratégies éprouvées pour optimiser 
                            votre gestion du temps et booster votre efficacité professionnelle.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                            <div className="text-gray-600 font-medium">Articles Experts</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                            <div className="text-gray-600 font-medium">Catégories</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                            <div className="text-gray-600 font-medium">Gratuit</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="text-3xl font-bold text-orange-600 mb-2">5★</div>
                            <div className="text-gray-600 font-medium">Qualité</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un article, technique ou outil..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === 'all'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Tous
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.id
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Explorez par Catégorie
                        </h2>
                        <p className="text-lg text-gray-600">
                            Trouvez rapidement les ressources adaptées à vos besoins
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <Link
                                    key={category.id}
                                    href={`/ressources/categories/${category.id}`}
                                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-transparent block"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                        <span>Explorer</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            {featuredOnly.length > 0 && (
                <section className="py-16 px-4 bg-white/50">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Articles à la Une
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Nos contenus les plus populaires et récents
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                                <span className="text-sm font-medium text-gray-600">En vedette</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredOnly.slice(0, 3).map((article, index) => (
                                <Link
                                    key={article.id}
                                    href={`/ressources/${article.id}`}
                                    className="group block"
                                >
                                    <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                                        <div className="relative">
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                <div className="text-4xl">
                                                    {article.category === 'productivite' ? '⚡' :
                                                        article.category === 'gestion-temps' ? '⏰' :
                                                            article.category === 'integrations' ? '🔗' : '📊'}
                                                </div>
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    Featured
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-700">
                                                    {article.readTime}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                                            <div className="flex items-center mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.category === 'productivite' ? 'bg-yellow-100 text-yellow-800' :
                                                        article.category === 'gestion-temps' ? 'bg-blue-100 text-blue-800' :
                                                            article.category === 'integrations' ? 'bg-green-100 text-green-800' :
                                                                'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {categories.find(c => c.id === article.category)?.name}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight flex-grow">
                                                {article.title}
                                            </h3>

                                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                                {article.excerpt}
                                            </p>

                                            <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform mt-auto">
                                                <span>Lire l'article</span>
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Articles */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {selectedCategory === 'all' ? 'Tous les Articles' : `Articles - ${categories.find(c => c.id === selectedCategory)?.name}`}
                        </h2>
                        <p className="text-lg text-gray-600">
                            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularArticles.map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/ressources/${article.id}`}
                                className="group block"
                            >
                                <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                                    <div className="relative">
                                        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <div className="text-4xl">
                                                {article.category === 'productivite' ? '⚡' :
                                                    article.category === 'gestion-temps' ? '⏰' :
                                                        article.category === 'integrations' ? '🔗' : '📊'}
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-700">
                                                {article.readTime}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col h-[calc(100%-10rem)]">
                                        <div className="flex items-center mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.category === 'productivite' ? 'bg-yellow-100 text-yellow-800' :
                                                    article.category === 'gestion-temps' ? 'bg-blue-100 text-blue-800' :
                                                        article.category === 'integrations' ? 'bg-green-100 text-green-800' :
                                                            'bg-purple-100 text-purple-800'
                                                }`}>
                                                {categories.find(c => c.id === article.category)?.name}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight flex-grow">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                                            {article.excerpt}
                                        </p>

                                        <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform mt-auto">
                                            <span>Lire l'article</span>
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
                            <p className="text-gray-600 mb-6">
                                Essayez de modifier vos critères de recherche ou explorez une autre catégorie.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('all')
                                }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Voir tous les articles
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Prêt à Transformer Votre Productivité ?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Mettez en pratique ces techniques avec ChronoFlow, l'outil de gestion du temps 
                        qui s'adapte à votre workflow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                        >
                            Commencer Gratuitement
                            <ArrowRight className="ml-2 w-5 h-5" />
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
        </div>
    )
}
