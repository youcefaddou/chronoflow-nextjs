import Link from 'next/link'
import { ArrowLeft, Clock, User, Calendar, ArrowRight, Zap } from 'lucide-react'

const productivityArticles = [
  {
    id: 'pomodoro-developpeurs',
    title: '10 Techniques de Pomodoro pour Développeurs',
    excerpt: 'Découvrez comment adapter la technique Pomodoro aux spécificités du développement logiciel pour maximiser votre concentration.',
    readTime: '8 min',
    publishDate: '15 juin 2025',
    featured: true
  },
  {
    id: 'freelances-doubler-productivite',
    title: 'Comment les Freelances Peuvent Doubler Leur Productivité',
    excerpt: 'Stratégies éprouvées et outils essentiels pour les freelances qui veulent optimiser leur temps et augmenter leurs revenus.',
    readTime: '10 min',
    publishDate: '14 juin 2025',
    featured: true
  },
  {
    id: 'erreurs-productivite-freelances',
    title: '5 Erreurs qui Ruinent la Productivité des Freelances',
    excerpt: 'Identifiez et évitez les pièges les plus courants qui sabotent la productivité des travailleurs indépendants.',
    readTime: '7 min',
    publishDate: '8 juin 2025',
    featured: false
  }
]

export default function ProductivitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/ressources"
              className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux ressources
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mr-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-700">Catégorie Productivité</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Maximisez Votre
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent block">
                Productivité
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Découvrez les techniques, méthodes et stratégies éprouvées pour optimiser votre efficacité professionnelle et atteindre vos objectifs plus rapidement.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{productivityArticles.length}</div>
                <div className="text-sm text-gray-600">Articles Experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">25k+</div>
                <div className="text-sm text-gray-600">Lecteurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">40%</div>
                <div className="text-sm text-gray-600">Gain Productivité Moyen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {productivityArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/ressources/${article.id}`}
                className="group block"
              >
                <article className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full ${
                  article.featured ? 'ring-2 ring-yellow-200' : ''
                }`}>
                  {/* Article Image */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                      <div className="text-6xl">
                        {index === 0 ? '🍅' : index === 1 ? '🚀' : '⚡'}
                      </div>
                    </div>
                    
                    {article.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Zap className="w-3 h-3 mr-1" />
                          Populaire
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-700">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {article.publishDate}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors leading-tight flex-grow">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-yellow-600 font-medium group-hover:translate-x-1 transition-transform">
                        <span>Lire l'article</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        Expert
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          {/* More articles coming soon */}
          <div className="mt-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Plus d'Articles à Venir !
              </h3>
              <p className="text-gray-600 mb-6">
                Nous travaillons sur de nouveaux guides de productivité pour vous aider à atteindre vos objectifs encore plus efficacement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ressources"
                  className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Explorer Toutes les Catégories
                </Link>
                <Link
                  href="/signup"
                  className="border border-yellow-600 text-yellow-600 px-6 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-colors"
                >
                  Commencer avec ChronoFlow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Booster Votre Productivité ?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Mettez en pratique ces techniques avec ChronoFlow, l'outil de suivi du temps conçu pour maximiser votre efficacité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-yellow-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Commencer Gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/product"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-yellow-600 transition-colors"
            >
              Découvrir ChronoFlow
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
