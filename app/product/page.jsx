
'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { ProductCTAButton, FeatureCard, StatCard, TestimonialCard } from '../../components/product/product-components'
import { ChronoThumbnail, CalendarThumbnail, ReportsThumbnail } from '../../components/product/video-thumbnails'
import InteractiveMockup from '../../components/product/interactive-mockup'
import {
    Clock,
    Calendar,
    BarChart3,
    Zap,
    Shield,
    Download,
    ChevronRight,
    Play,
    Users,
    Briefcase,
    Target,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Star
} from 'lucide-react'

// Composant VideoThumbnail personnalisé ultra-attractif
function VideoThumbnail({ videoSrc, thumbnailSrc, title, isPlaying, onPlay, className = "", lazy = true, featureType = "default" }) {
    const [isLoaded, setIsLoaded] = useState(!lazy)
    const [imageError, setImageError] = useState(false)
    const thumbnailRef = useRef(null)

    // Lazy loading avec Intersection Observer
    useEffect(() => {
        if (!lazy || isLoaded) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsLoaded(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1, rootMargin: '50px' }
        )

        if (thumbnailRef.current) {
            observer.observe(thumbnailRef.current)
        }

        return () => {
            if (thumbnailRef.current) {
                observer.unobserve(thumbnailRef.current)
            }
        }
    }, [lazy, isLoaded])

    // Fonction pour obtenir le thumbnail SVG approprié
    const getSVGThumbnail = () => {
        switch (featureType) {
            case 'timer':
                return <ChronoThumbnail />
            case 'calendar':
                return <CalendarThumbnail />
            case 'reports':
                return <ReportsThumbnail />
            default:
                return (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="text-center z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <Play className="w-10 h-10 text-white ml-1" />
                            </div>
                            <p className="text-gray-700 font-semibold text-sm px-4">{title}</p>
                        </div>
                    </div>
                )
        }
    }

    if (!isLoaded) {
        return (
            <div
                ref={thumbnailRef}
                className={`relative aspect-video bg-gray-200 rounded-xl overflow-hidden animate-pulse ${className}`}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-400 ml-1" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative group cursor-pointer ${className}`} onClick={onPlay}>
            {!isPlaying ? (
                <>
                    {/* Thumbnail Container avec effet de profondeur */}
                    <div className="relative aspect-video bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 rounded-xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-white/20">
                        {/* Background Pattern pour un effet premium */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                            <div className="absolute top-0 left-0 w-full h-full" style={{
                                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                                                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
                            }}></div>
                        </div>

                        {thumbnailSrc && !imageError ? (
                            <img
                                src={thumbnailSrc}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full">
                                {getSVGThumbnail()}
                            </div>
                        )}

                        {/* Overlay avec effet glassmorphism */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 group-hover:from-black/50 transition-all duration-500 flex items-center justify-center">
                            {/* Bouton Play ultra-stylé */}
                            <div className="relative">
                                {/* Cercle externe pulsant */}
                                <div className="absolute inset-0 w-24 h-24 bg-white/20 rounded-full animate-ping group-hover:animate-none opacity-75"></div>

                                {/* Bouton principal */}
                                <div className="relative w-24 h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
                                    <Play className="w-12 h-12 text-blue-600 ml-1" />

                                    {/* Effet de brillance */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Badge "Démo" */}
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            ▶ Démo
                        </div>

                        {/* Titre en bas avec glassmorphism */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-sm p-4">
                            <p className="text-white font-semibold text-sm drop-shadow-lg">{title}</p>
                            <p className="text-white/80 text-xs mt-1">Cliquez pour voir la démo</p>
                        </div>

                        {/* Effet de bord lumineux au hover */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{ boxShadow: 'inset 0 0 0 2px rgba(59, 130, 246, 0.3)' }}></div>
                    </div>
                </>
            ) : (
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                    <video
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        preload="metadata"
                        poster={thumbnailSrc}
                    >
                        <source src={videoSrc} type="video/mp4" />
                        <p className="text-white p-4">Votre navigateur ne supporte pas les vidéos HTML5.</p>
                    </video>

                    {/* Bouton fermer */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlay() }}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
}

export default function ProductPage() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('freelances')
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [playingVideo, setPlayingVideo] = useState(null)
    const [sectionsInView, setSectionsInView] = useState({})
    const [preloadedVideos, setPreloadedVideos] = useState(new Set())
    const heroRef = useRef(null)
    const benefitsRef = useRef(null)
    const featuresRef = useRef(null)
    const useCasesRef = useRef(null)
    const ctaRef = useRef(null)

    // Preload vidéos critiques quand elles deviennent visibles
    const preloadVideo = (videoSrc) => {
        if (preloadedVideos.has(videoSrc)) return

        const video = document.createElement('video')
        video.preload = 'metadata'
        video.src = videoSrc
        setPreloadedVideos(prev => new Set([...prev, videoSrc]))
    }    // Animation on scroll et Intersection Observer pour lazy loading
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px'
        }

        const observer = new IntersectionObserver((entries) => {
            const newSectionsInView = { ...sectionsInView }

            entries.forEach((entry) => {
                const sectionName = entry.target.getAttribute('data-section')
                if (entry.isIntersecting && sectionName) {
                    newSectionsInView[sectionName] = true

                    // Preload vidéos quand la section features devient visible
                    if (sectionName === 'features') {
                        features.forEach(feature => {
                            if (feature.video) {
                                setTimeout(() => preloadVideo(feature.video), 500)
                            }
                        })
                    }
                }

                // Animation on scroll
                if (entry.isIntersecting) {
                    const fadeElements = entry.target.querySelectorAll('.fade-in-up')
                    fadeElements.forEach((el) => {
                        el.classList.add('animate-fade-in')
                    })
                }
            })

            setSectionsInView(newSectionsInView)
        }, observerOptions)        // Observer les sections principales
        const sections = [heroRef, benefitsRef, featuresRef, useCasesRef, ctaRef]
        sections.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current)
            }
        })

        return () => {
            sections.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current)
                }
            })
        }
    }, [sectionsInView])

    // Handle ESC key to close video modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27 && isVideoPlaying) {
                setIsVideoPlaying(false)
            }
        }

        if (isVideoPlaying) {
            document.addEventListener('keydown', handleEsc)
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isVideoPlaying])
    const features = [
        {
            icon: <Clock className="w-8 h-8 text-blue-600" />,
            title: t('product.features.timer.title') || 'Chronomètre Intelligent',
            description: t('product.features.timer.desc') || 'Démarrez, pausez et suivez votre temps avec précision. Mode focus pour éliminer les distractions.',
            benefits: [
                t('product.features.timer.benefit1') || 'Suivi précis à la seconde',
                t('product.features.timer.benefit2') || 'Mode focus anti-distraction',
                t('product.features.timer.benefit3') || 'Sauvegarde automatique'
            ],
            video: '/assets/videos/chrono-demo.mp4',
            videoTitle: t('product.features.timer.videoTitle') || 'Démo Chronomètre',
            thumbnail: '/assets/images/thumbnails/chrono-demo-thumb.jpg',
            type: 'timer'
        },
        {
            icon: <Calendar className="w-8 h-8 text-green-600" />,
            title: t('product.features.calendar.title') || 'Synchronisation Calendar',
            description: t('product.features.calendar.desc') || 'Intégrez vos événements Google Calendar directement dans votre suivi de temps.',
            benefits: [
                t('product.features.calendar.benefit1') || 'Synchronisation Google Calendar',
                t('product.features.calendar.benefit2') || 'Vue unifiée des tâches',
                t('product.features.calendar.benefit3') || 'Planification intelligente'
            ],
            video: '/assets/videos/calendar-import.mp4',
            videoTitle: t('product.features.calendar.videoTitle') || 'Démo Synchronisation',
            thumbnail: '/assets/images/thumbnails/calendar-sync-thumb.jpg',
            type: 'calendar'
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
            title: t('product.features.reports.title') || 'Rapports Détaillés',
            description: t('product.features.reports.desc') || 'Analysez votre productivité avec des rapports personnalisés et exportez vos données.',
            benefits: [
                t('product.features.reports.benefit1') || 'Statistiques détaillées',
                t('product.features.reports.benefit2') || 'Export PDF/CSV',
                t('product.features.reports.benefit3') || 'Rapports détaillés'
            ],
            video: '/assets/videos/reports-demo.mp4',
            videoTitle: t('product.features.reports.videoTitle') || 'Démo Rapports',
            thumbnail: '/assets/images/thumbnails/reports-demo-thumb.jpg',
            type: 'reports'
        }
    ]

    const useCases = [
        {
            id: 'freelances',
            icon: <Briefcase className="w-6 h-6" />,
            title: t('product.useCases.freelances.title') || 'Freelances',
            description: t('product.useCases.freelances.desc') || 'Facturez précisément vos clients et optimisez votre temps.',
            stats: {
                time: t('product.useCases.freelances.stat1') || '3h économisées/semaine',
                productivity: t('product.useCases.freelances.stat2') || '+40% de productivité',
                billing: t('product.useCases.freelances.stat3') || '100% de précision tracking'
            },
            testimonial: {
                text: t('product.useCases.freelances.testimonial') || "ChronoFlow m'a permis d'augmenter mes revenus de 25% en optimisant parfaitement mon temps de travail.",
                author: 'Marie Dubois',
                role: t('product.useCases.freelances.role') || 'Designer Freelance'
            }
        },
        {
            id: 'pme',
            icon: <Users className="w-6 h-6" />,
            title: t('product.useCases.pme.title') || 'PME',
            description: t('product.useCases.pme.desc') || 'Gérez les projets de votre équipe et optimisez la rentabilité.',
            stats: {
                time: t('product.useCases.pme.stat1') || '15h économisées/équipe/semaine',
                productivity: t('product.useCases.pme.stat2') || '+60% de rentabilité projets',
                billing: t('product.useCases.pme.stat3') || '0 erreur de suivi'
            },
            testimonial: {
                text: t('product.useCases.pme.testimonial') || "Nos projets sont désormais tous rentables grâce au suivi précis de ChronoFlow.",
                author: 'Pierre Martin',
                role: t('product.useCases.pme.role') || 'CEO, Agence Créative'
            }
        }
    ]

    const benefits = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: t('product.benefits.simple.title') || 'Simple à utiliser',
            description: t('product.benefits.simple.desc') || 'Interface intuitive, aucune formation requise'
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-500" />,
            title: t('product.benefits.efficient.title') || 'Ultra efficace',
            description: t('product.benefits.efficient.desc') || 'Économisez des heures chaque semaine'
        },
        {
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            title: t('product.benefits.secure.title') || 'Sécurisé',
            description: t('product.benefits.secure.desc') || 'Vos données sont protégées et sauvegardées'
        }
    ]

    return (
        <>
            <div className="min-h-screen bg-white">                <style jsx>{`
          .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          .animate-fade-in {
            opacity: 1;
            transform: translateY(0);
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .floating {
            animation: float 3s ease-in-out infinite;
          }

          /* Animations pour la modal */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Effet de glassmorphism pour les thumbnails */
          .glass-effect {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          /* Animation de pulsation douce */
          .pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          /* Effet de brillance sur les boutons */
          .shine-effect {
            position: relative;
            overflow: hidden;
          }
          
          .shine-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
          }
          
          .shine-effect:hover::before {
            left: 100%;
          }
        `}</style>                {/* Hero Section */}
                <section ref={heroRef} data-section="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Hero Content */}
                            <div className="fade-in-up">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                    {t('product.hero.title') || (
                                        <>
                                            Le <span className="text-blue-600">logiciel de suivi du temps</span> le plus simple pour
                                            <span className="text-purple-600"> freelances et PME</span>
                                        </>
                                    )}
                                </h1>

                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {t('product.hero.subtitle') ||
                                        'Chronométrez vos projets, synchronisez votre calendar et boostez votre productivité avec ChronoFlow. Simple, efficace, sans complications.'
                                    }
                                </p>              {/* Hero Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <StatCard value="+40%" label={t('product.hero.stat1') || 'Productivité'} color="blue" />
                                    <StatCard value="3h" label={t('product.hero.stat2') || 'Économisées/semaine'} color="green" />
                                    <StatCard value="100%" label={t('product.hero.stat3') || 'Précision'} color="purple" />
                                </div>              {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <ProductCTAButton href="/signup" variant="primary">
                                        {t('product.hero.cta') || 'Essayer gratuitement'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </ProductCTAButton>                <ProductCTAButton
                                        variant="secondary"
                                        onClick={() => setIsVideoPlaying(true)}
                                    >
                                        <Play className="mr-2 w-5 h-5" />
                                        {t('product.hero.demo') || 'Voir la démo'}
                                    </ProductCTAButton>
                                </div>
                            </div>

                            {/* Hero Visual */}
                            <div className="fade-in-up lg:pl-8">
                                <div className="relative">
                                    <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-700">ChronoFlow</div>
                                        </div>

                                        {/* Mock Timer Interface */}
                                        <div className="text-center py-8">
                                            <div className="text-5xl font-mono text-blue-600 mb-4">02:45:12</div>
                                            <div className="text-gray-600 mb-6">Développement Site Client</div>
                                            <div className="flex justify-center space-x-4">
                                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                                                    {t('common.pause') || 'Pause'}
                                                </button>
                                                <button className="bg-red-600 text-white px-6 py-2 rounded-lg">
                                                    {t('common.stop') || 'Stop'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 -mt-4 opacity-10">
                        <Clock className="w-96 h-96 text-blue-600" />
                    </div>
                </section>                {/* Benefits Section */}
                <section ref={benefitsRef} data-section="benefits" className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {t('product.benefits.title') || 'Pourquoi choisir ChronoFlow ?'}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('product.benefits.subtitle') ||
                                    'Nous avons conçu ChronoFlow pour répondre aux besoins spécifiques des freelances et PME qui veulent optimiser leur temps sans complications.'
                                }
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="fade-in-up text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-white rounded-full shadow-lg">
                                            {benefit.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>{/* Features Section */}
                <section ref={featuresRef} data-section="features" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {t('product.features.title') || 'Fonctionnalités qui font la différence'}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('product.features.subtitle') ||
                                    'Découvrez les outils qui vont transformer votre gestion du temps et booster votre productivité.'
                                }
                            </p>
                        </div><div className="space-y-16">
                            {features.map((feature, index) => (
                                <div key={index} className="fade-in-up">
                                    <FeatureCard
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                        benefits={feature.benefits}
                                        reverse={index % 2 === 1}
                                    >                                        {feature.video && sectionsInView.features && (
                                        <VideoThumbnail
                                            videoSrc={feature.video}
                                            thumbnailSrc={feature.thumbnail}
                                            title={feature.videoTitle}
                                            isPlaying={playingVideo === `feature-${index}`}
                                            onPlay={() => setPlayingVideo(playingVideo === `feature-${index}` ? null : `feature-${index}`)}
                                            className="shadow-2xl transform hover:scale-105 transition-transform duration-300 shine-effect"
                                            lazy={true}
                                            featureType={feature.type}
                                        />
                                    )}
                                    </FeatureCard>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Use Cases Section */}
                <section ref={useCasesRef} data-section="useCases" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 relative">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-500"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12 fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {t('product.useCases.title') || 'Conçu pour votre métier'}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('product.useCases.subtitle') ||
                                    'Découvrez comment ChronoFlow transforme le quotidien des professionnels comme vous.'
                                }
                            </p>
                        </div>
                        {/* Use Case Tabs */}
                        <div className="flex justify-center mb-8 fade-in-up">
                            <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100 flex">
                                {useCases.map((useCase) => (
                                    <button
                                        key={useCase.id}
                                        onClick={() => setActiveTab(useCase.id)}
                                        className={`flex items-center justify-center w-40 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === useCase.id
                                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {useCase.icon}
                                        <span className="ml-2">{useCase.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Use Case Content */}
                        {useCases.map((useCase) => (
                            <div
                                key={useCase.id}
                                className={`fade-in-up ${activeTab === useCase.id ? 'block' : 'hidden'}`}
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                {useCase.description}
                                            </h3>

                                            {/* Stats */}
                                            <div className="grid grid-cols-1 gap-4 mb-8">
                                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                                    <span className="text-gray-700">{t('product.useCases.timeLabel') || 'Temps économisé'}</span>
                                                    <span className="font-bold text-green-600">{useCase.stats.time}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                                    <span className="text-gray-700">{t('product.useCases.productivityLabel') || 'Amélioration'}</span>
                                                    <span className="font-bold text-blue-600">{useCase.stats.productivity}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                                    <span className="text-gray-700">{t('product.useCases.trackingLabel') || 'Suivi précis'}</span>
                                                    <span className="font-bold text-purple-600">{useCase.stats.billing}</span>
                                                </div>
                                            </div>                    {/* Testimonial */}
                                            <TestimonialCard
                                                text={useCase.testimonial.text}
                                                author={useCase.testimonial.author}
                                                role={useCase.testimonial.role}
                                            />
                                        </div>
                                        <div>
                                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                                                <InteractiveMockup activeTab={activeTab} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>                {/* CTA Section */}
                <section ref={ctaRef} data-section="cta" className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            {t('product.cta.title') || 'Prêt à transformer votre productivité ?'}
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            {t('product.cta.subtitle') ||
                                'Rejoignez des milliers de freelances et PME qui ont déjà optimisé leur gestion du temps avec ChronoFlow.'
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ProductCTAButton href="/signup" variant="white">
                                {t('product.cta.start') || 'Commencer gratuitement'}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </ProductCTAButton>
                            <ProductCTAButton href="/contact" variant="secondary" className="border-white text-white hover:bg-white hover:text-blue-600">
                                {t('product.cta.contact') || 'Nous contacter'}
                            </ProductCTAButton>
                        </div>                        <div className="mt-8 text-blue-100 text-sm">
                            {t('product.cta.note') || '✓ Essai gratuit • ✓ Aucune carte requise • ✓ Support français'}
                        </div>
                    </div>
                </section>                {/* Video Demo Modal - Ultra Design */}
                {isVideoPlaying && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden transform animate-scaleIn">
                            {/* Gradient Border Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl p-[2px]">
                                <div className="bg-white rounded-3xl h-full w-full"></div>
                            </div>

                            <div className="relative z-10">                                {/* Modal Header simplifié */}
                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm border-b border-gray-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Démonstration
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setIsVideoPlaying(false)}
                                        className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90 group"
                                        aria-label="Fermer"
                                    >
                                        <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Video Content avec cadre premium */}
                                <div className="p-6">
                                    <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-inner">
                                        {/* Cadre décoratif */}
                                        <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none"></div>

                                        <video
                                            className="w-full h-full object-cover rounded-2xl"
                                            controls
                                            autoPlay
                                            preload="metadata"
                                            poster="/assets/images/demo-poster.jpg"
                                        >
                                            <source src="/assets/videos/demo-general.mp4" type="video/mp4" />
                                            <div className="flex items-center justify-center h-full text-white">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Play className="w-8 h-8 text-white ml-1" />
                                                    </div>
                                                    <p className="text-lg">Votre navigateur ne supporte pas les vidéos HTML5.</p>
                                                    <p className="text-sm text-white/70 mt-2">Veuillez mettre à jour votre navigateur</p>
                                                </div>
                                            </div>
                                        </video>
                                    </div>

                                    {/* Video Description avec badges */}
                                    <div className="mt-6 text-center">
                                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                ⏱️ Suivi temps
                                            </span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                📅 Synchronisation
                                            </span>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                                📊 Rapports
                                            </span>
                                        </div>
                                        <p className="text-gray-600 max-w-2xl mx-auto">
                                            {t('product.demo.description') || 'Découvrez ChronoFlow en action : suivi du temps, synchronisation calendar et rapports détaillés.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Modal Footer CTA avec effet premium */}
                                <div className="px-6 pb-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                                        <div className="text-center mb-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                {t('product.demo.cta_title') || 'Prêt à booster votre productivité ?'}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {t('product.demo.cta_subtitle') || 'Commencez gratuitement dès maintenant'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <ProductCTAButton href="/signup" variant="primary" className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                                                {t('product.demo.cta') || 'Commencer gratuitement'}
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </ProductCTAButton>
                                            <ProductCTAButton
                                                href="/contact"
                                                variant="secondary"
                                                onClick={() => setIsVideoPlaying(false)}
                                                className="hover:bg-gray-50 transition-all duration-200"
                                            >
                                                {t('product.demo.contact') || 'Poser une question'}
                                            </ProductCTAButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
