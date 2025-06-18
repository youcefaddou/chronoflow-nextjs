import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    Clock,
    ArrowLeft,
    Share2,
    BookOpen,
    CheckCircle,
    Lightbulb,
    Target,
    Zap,
    Calendar,
    Users,
    ArrowRight,
    Star,
    TrendingUp,
    Award
} from 'lucide-react'

// Articles data
const articlesData = {
    'pomodoro-developpeurs': {
        title: '10 Techniques de Pomodoro pour Développeurs',
        excerpt: 'Découvrez comment adapter la technique Pomodoro aux spécificités du développement logiciel pour maximiser votre concentration.',
        category: 'productivite',
        readTime: '8 min',
        publishDate: '15 juin 2025',
        author: 'Équipe ChronoFlow',
        image: '/assets/articles/pomodoro-dev.jpg',
        content: [
            {
                type: 'heading',
                level: 1,
                content: '10 Techniques de Pomodoro pour Développeurs'
            },
            {
                type: 'paragraph',
                content: 'La technique Pomodoro, créée par Francesco Cirillo dans les années 1980, est devenue un pilier de la productivité moderne. Mais pour les développeurs, cette méthode nécessite quelques adaptations pour s\'harmoniser avec la nature unique du code et de la résolution de problèmes.'
            },
            {
                type: 'heading',
                level: 2,
                content: 'Pourquoi le Pomodoro Classique Ne Suffit Pas en Développement'
            },
            {
                type: 'paragraph',
                content: 'Le développement logiciel présente des défis uniques :'
            },
            {
                type: 'list',
                items: [
                    { content: 'État de flow profond : Une fois dans le flow, être interrompu peut coûter 15-25 minutes pour revenir au même niveau de concentration', type: 'bullet' },
                    { content: 'Problèmes complexes : Certains bugs ou architectures nécessitent une réflexion continue de plus de 25 minutes', type: 'bullet' },
                    { content: 'Compilation et tests : Les temps d\'attente naturels créent des pauses organiques', type: 'bullet' }
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: 'Les 10 Techniques Adaptées aux Développeurs'
            },
            {
                type: 'heading',
                level: 3,
                content: '1. Le Pomodoro Élastique (25-45 minutes)'
            },
            {
                type: 'paragraph',
                content: 'Adaptez la durée selon la complexité de la tâche :'
            },
            {
                type: 'list',
                items: [
                    { content: 'Debugging simple : 25 minutes classiques', type: 'bullet' },
                    { content: 'Architecture ou refactoring : 45 minutes', type: 'bullet' },
                    { content: 'Code review : 15 minutes', type: 'bullet' }
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                content: '🔧 Avec ChronoFlow : Personnalisez vos timers par type de tâche et laissez l\'outil s\'adapter automatiquement.'
            },
            {
                type: 'heading',
                level: 3,
                content: '2. La Technique du "Commit Pomodoro"'
            },
            {
                type: 'paragraph',
                content: 'Chaque Pomodoro doit se terminer par un commit Git :'
            },
            {
                type: 'list',
                items: [
                    { content: 'Force la progression incrémentale', type: 'bullet' },
                    { content: 'Crée des points de sauvegarde naturels', type: 'bullet' },
                    { content: 'Facilite le suivi des progrès', type: 'bullet' }
                ]
            },
            {
                type: 'heading',
                level: 3,
                content: '3. Le Pomodoro de Documentation'
            },
            {
                type: 'paragraph',
                content: 'Dédiez 1 Pomodoro sur 4 à la documentation :'
            },
            {
                type: 'list',
                items: [
                    { content: 'Comments de code', type: 'bullet' },
                    { content: 'README updates', type: 'bullet' },
                    { content: 'Tests unitaires', type: 'bullet' },
                    { content: 'Documentation technique', type: 'bullet' }
                ]
            },
            {
                type: 'heading',
                level: 3,
                content: '4. La Pause Active Technique'
            },
            {
                type: 'paragraph',
                content: 'Pendant vos pauses de 5 minutes :'
            },
            {
                type: 'list',
                items: [
                    { content: 'Faites quelques étirements', type: 'check' },
                    { content: 'Hydratez-vous', type: 'check' },
                    { content: 'Regardez par la fenêtre', type: 'check' },
                    { content: 'Marchez quelques pas', type: 'check' },
                    { content: 'Évitez les réseaux sociaux', type: 'cross' },
                    { content: 'Évitez les emails', type: 'cross' }
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: 'Mise en Pratique avec ChronoFlow'
            },
            {
                type: 'heading',
                level: 3,
                content: 'Configuration Intelligente'
            },
            {
                type: 'list',
                items: [
                    { content: 'Timers personnalisés par type de tâche', type: 'bullet' },
                    { content: 'Statistiques détaillées pour optimiser vos durées', type: 'bullet' },
                    { content: 'Intégration Git pour tracker les commits par Pomodoro', type: 'bullet' }
                ]
            },
            {
                type: 'heading',
                level: 3,
                content: 'Suivi Avancé'
            },
            {
                type: 'list',
                items: [
                    { content: 'Analyse des patterns de productivité', type: 'bullet' },
                    { content: 'Rapports de flow state pour identifier vos meilleurs moments', type: 'bullet' },
                    { content: 'Suggestions d\'optimisation basées sur vos données', type: 'bullet' }
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: 'Mesurer Votre Succès'
            },
            {
                type: 'heading',
                level: 3,
                content: 'Métriques Clés à Suivre'
            },
            {
                type: 'list',
                items: [
                    { content: 'Nombre de Pomodoros complétés par jour', type: 'number', number: 1 },
                    { content: 'Ratio de Pomodoros interrompus vs terminés', type: 'number', number: 2 },
                    { content: 'Corrélation entre type de tâche et productivité', type: 'number', number: 3 },
                    { content: 'Temps de flow state par session', type: 'number', number: 4 },
                    { content: 'Évolution de la complexité des tâches accomplies', type: 'number', number: 5 }
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: 'Conclusion'
            },
            {
                type: 'paragraph',
                content: 'La technique Pomodoro, adaptée intelligemment au développement, peut transformer votre productivité. L\'important n\'est pas de suivre aveuglément la méthode classique, mais de l\'adapter à vos besoins spécifiques de développeur.'
            },
            {
                type: 'paragraph',
                content: 'Avec les bonnes adaptations et les bons outils comme ChronoFlow, vous pouvez :'
            },
            {
                type: 'list',
                items: [
                    { content: 'Augmenter votre focus de 40% en moyenne', type: 'bullet' },
                    { content: 'Réduire les interruptions de 60%', type: 'bullet' },
                    { content: 'Améliorer la qualité du code grâce à une approche structurée', type: 'bullet' },
                    { content: 'Maintenir un équilibre travail-vie personnelle sain', type: 'bullet' }
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                content: '💡 Astuce Pro : Utilisez ChronoFlow pour tracker automatiquement vos Pomodoros et identifier vos patterns de productivité optimaux. L\'intégration avec votre calendrier et vos outils de développement rend le processus totalement transparent.'
            }
        ],
        stats: {
            focusImprovement: '40%',
            interruptionReduction: '60%',
            satisfactionRate: '95%'
        }
    },
    'freelances-doubler-productivite': {
        title: 'Comment les Freelances Peuvent Doubler Leur Productivité',
        excerpt: 'Stratégies éprouvées et outils essentiels pour les freelances qui veulent optimiser leur temps et augmenter leurs revenus.',
        category: 'productivite',
        readTime: '10 min',
        publishDate: '14 juin 2025',
        author: 'Expert ChronoFlow',
        content: []
    }
}

const categoryNames = {
    'productivite': 'Productivité',
    'gestion-temps': 'Gestion du Temps',
    'integrations': 'Intégrations',
    'outils': 'Outils'
}

// Component to render different content types
function ContentRenderer({ content }) {
    return (
        <div className="space-y-6">
            {content.map((item, index) => {
                switch (item.type) {
                    case 'heading':
                        const HeadingTag = `h${item.level}`
                        const headingStyles = {
                            1: 'text-4xl font-bold text-gray-900 mt-12 mb-6 first:mt-0',
                            2: 'text-3xl font-bold text-gray-900 mt-10 mb-5 border-l-4 border-blue-500 pl-6',
                            3: 'text-2xl font-semibold text-gray-800 mt-8 mb-4',
                            4: 'text-xl font-medium text-gray-800 mt-6 mb-3'
                        }
                        
                        return React.createElement(HeadingTag, {
                            key: index,
                            className: headingStyles[item.level]
                        }, item.content)

                    case 'paragraph':
                        return (
                            <p key={index} className="text-gray-700 text-lg leading-relaxed">
                                {item.content}
                            </p>
                        )

                    case 'list':
                        if (item.items[0]?.type === 'number') {
                            return (
                                <ol key={index} className="space-y-3">
                                    {item.items.map((listItem, listIndex) => (
                                        <li key={listIndex} className="flex items-start gap-4">
                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                                {listItem.number}
                                            </span>
                                            <span className="text-gray-700 text-lg leading-relaxed flex-1">
                                                {listItem.content}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            )
                        }
                        
                        return (
                            <ul key={index} className="space-y-3">
                                {item.items.map((listItem, listIndex) => (
                                    <li key={listIndex} className="flex items-start gap-3">
                                        {listItem.type === 'check' && (
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        )}
                                        {listItem.type === 'cross' && (
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <span className="text-red-500 font-bold text-lg">×</span>
                                            </div>
                                        )}
                                        {listItem.type === 'bullet' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                        )}
                                        <span className={`text-lg leading-relaxed flex-1 ${
                                            listItem.type === 'check' ? 'text-green-700' : 
                                            listItem.type === 'cross' ? 'text-red-700' : 
                                            'text-gray-700'
                                        }`}>
                                            {listItem.content}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )

                    case 'callout':
                        const variants = {
                            tip: {
                                bg: 'bg-yellow-50',
                                border: 'border-yellow-200',
                                text: 'text-yellow-800',
                                icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
                            },
                            info: {
                                bg: 'bg-blue-50',
                                border: 'border-blue-200',
                                text: 'text-blue-800',
                                icon: <Zap className="w-5 h-5 text-blue-600" />
                            }
                        }
                        
                        const variant = variants[item.variant] || variants.info
                        
                        return (
                            <div key={index} className={`${variant.bg} ${variant.border} border-l-4 p-6 rounded-r-lg`}>
                                <div className="flex items-start gap-3">
                                    {variant.icon}
                                    <p className={`${variant.text} text-lg leading-relaxed flex-1`}>
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        )

                    default:
                        return null
                }
            })}
        </div>
    )
}

export default function ArticlePage({ params }) {
    const article = articlesData[params.slug]
    
    if (!article) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/ressources" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour aux ressources</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                <Share2 className="w-4 h-4" />
                                Partager
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                                {categoryNames[article.category]}
                            </span>
                            {article.stats && (
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span>+{article.stats.focusImprovement} focus</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award className="w-4 h-4 text-yellow-500" />
                                        <span>{article.stats.satisfactionRate} satisfaction</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
                            {article.title}
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                            {article.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 pb-8 border-b border-gray-200 max-w-2xl mx-auto">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime} de lecture</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{article.publishDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{article.author}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <article className="mb-16">
                    <ContentRenderer content={article.content} />
                </article>

                {/* CTA Section */}
                <div className="mt-16 p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
                    <div className="relative text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">
                            Prêt à Booster Votre Productivité ?
                        </h3>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Rejoignez plus de 10,000 professionnels qui utilisent ChronoFlow pour optimiser leur gestion du temps et doubler leur productivité.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/signup" 
                                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Commencer Gratuitement
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link 
                                href="/dashboard/timer" 
                                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-200 flex items-center gap-2 justify-center"
                            >
                                <Zap className="w-5 h-5" />
                                Essayer le Timer
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Articles */}
                <div className="mt-20">
                    <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Articles Recommandés</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {Object.entries(articlesData)
                            .filter(([slug]) => slug !== params.slug)
                            .slice(0, 2)
                            .map(([slug, relatedArticle]) => (
                                <Link 
                                    key={slug}
                                    href={`/ressources/${slug}`}
                                    className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                                            <BookOpen className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    {categoryNames[relatedArticle.category]}
                                                </span>
                                                <span className="text-xs text-gray-500">{relatedArticle.readTime}</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                                                {relatedArticle.title}
                                            </h4>
                                            <p className="text-gray-600 mb-4 leading-relaxed">
                                                {relatedArticle.excerpt}
                                            </p>
                                            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                                <span>Lire l'article</span>
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
