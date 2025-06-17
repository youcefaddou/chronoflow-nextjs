'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Play, ArrowRight, Clock, BarChart3, Calendar, CheckCircle, Zap, X, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Intersection Observer pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -100px 0px' 
      }
    )

    // Observer toutes les sections avec animation
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // Gestion vidéo modal
  const openVideoModal = () => setIsVideoModalOpen(true)
  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // Fermer modal avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeVideoModal()
    }
    if (isVideoModalOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isVideoModalOpen])

  return (
    <div className="min-h-screen bg-white overflow-hidden">      {/* Hero Section avec animations ultra-modernes */}
      <section 
        data-section="hero"
        className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center overflow-hidden intersect-fade"
      >
        {/* Animations de fond fluides */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient animé */}
          <div className="absolute inset-0 animate-gradient opacity-10"></div>
          
          {/* Bulles flottantes */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-300/15 rounded-full blur-2xl animate-float delay-500"></div>
          
          {/* Particules animées */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-40 left-40 w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu gauche avec animations séquentielles */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge animé avec glow */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium animate-fade-in-up hover-scale animate-glow">
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                {t('home.hero.badge')}
              </div>
              
              {/* Titre avec effet de frappe */}
              <div className="space-y-2 animate-fade-in-up delay-200">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block animate-slide-in-up">{t('home.hero.title')}</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-slide-in-up delay-300">
                    {t('home.hero.highlight')}
                  </span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-500">
                {t('home.hero.subtitle')}
              </p>

              {/* Boutons CTA avec animations élaborées */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-700">
                <Link
                  href="/signup"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-lift hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {t('home.hero.cta.primary')}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                </Link>
                
                <button 
                  onClick={openVideoModal}
                  className="group relative inline-flex items-center justify-center border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg backdrop-blur-sm hover-lift"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110 animate-glow">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                  {t('home.hero.cta.demo')}
                </button>
              </div>

              {/* Indicateurs de confiance avec animations */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500 animate-fade-in-up delay-1000">
                {[
                  { icon: CheckCircle, text: t('home.hero.trust.trial'), color: 'text-green-500' },
                  { icon: CheckCircle, text: t('home.hero.trust.setup'), color: 'text-blue-500' },
                  { icon: CheckCircle, text: t('home.hero.trust.support'), color: 'text-purple-500' }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center hover:scale-105 transition-transform duration-200 delay-${index * 100}`}>
                    <item.icon className={`w-4 h-4 ${item.color} mr-2 animate-pulse`} style={{ animationDelay: `${index * 200}ms` }} />
                    <span className="hover:text-gray-700 transition-colors duration-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup droite avec animations 3D */}
            <div className="relative animate-fade-in-left delay-300">
              {/* Carte principale avec effet 3D */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 transition-all duration-700 hover-lift hover-rotate">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        Task Client #1
                      </h3>
                      <span className="text-2xl font-bold font-mono animate-fade-in">02:34:12</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover-scale">
                        <div className="flex justify-between items-center">
                          <span>Design Interface</span>
                          <span className="text-green-300 animate-pulse text-lg">●</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                          <div className="bg-green-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover-scale">
                        <div className="flex justify-between items-center">
                          <span>Développement</span>
                          <span className="text-yellow-300 text-lg">⏸</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                          <div className="bg-yellow-400 h-2 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Éléments flottants animés */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-lg animate-float hover-scale hover-rotate">
                <Clock className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white p-3 rounded-xl shadow-lg animate-float hover-scale hover-rotate delay-500">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg shadow-lg animate-ping">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              {/* Notifications flottantes */}
              <div className="absolute top-16 -left-8 bg-white rounded-lg shadow-lg p-3 animate-slide-in-up delay-1000">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-gray-600">+25% productivité</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>      {/* Stats Section avec compteurs animés */}
      <section 
        data-section="stats"
        className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 intersect-fade"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              {t('home.stats.title')}
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up delay-200">
              {t('home.stats.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                number: t('home.stats.productivity.number'), 
                label: t('home.stats.productivity.label'), 
                color: 'from-blue-600 to-cyan-600', 
                bgColor: 'bg-blue-100',
                delay: 'delay-0',
                icon: TrendingUp
              },
              { 
                number: t('home.stats.time.number'), 
                label: t('home.stats.time.label'), 
                color: 'from-green-600 to-emerald-600', 
                bgColor: 'bg-green-100',
                delay: 'delay-100',
                icon: Clock
              },
              { 
                number: t('home.stats.accuracy.number'), 
                label: t('home.stats.accuracy.label'), 
                color: 'from-purple-600 to-violet-600', 
                bgColor: 'bg-purple-100',
                delay: 'delay-200',
                icon: CheckCircle
              },
              { 
                number: t('home.stats.revenue.number'), 
                label: t('home.stats.revenue.label'), 
                color: 'from-orange-600 to-red-600', 
                bgColor: 'bg-orange-100',
                delay: 'delay-300',
                icon: BarChart3
              }
            ].map((stat, index) => (
              <div key={index} className={`group text-center ${stat.delay}`}>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift hover-scale">
                  {/* Icône avec gradient */}
                  <div className={`w-16 h-16 mx-auto mb-4 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  
                  {/* Compteur animé */}
                  <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-200">
                    {stat.label}
                  </div>
                  
                  {/* Barre de progression décorative */}
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full transform origin-left transition-transform duration-1000 delay-${index * 200} group-hover:scale-x-100`} 
                         style={{ transform: `scaleX(${0.2 + (index * 0.2)})` }}></div>
                  </div>
                  
                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-700 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Témoignage rapide */}
          <div className="text-center mt-16 animate-fade-in-up delay-500">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex -space-x-2 mr-4">
                {[1,2,3].map((i) => (
                  <div key={i} className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white animate-pulse delay-${i * 100}`}></div>
                ))}
              </div>
              <span className="text-gray-600 font-medium">{t('home.stats.testimonial')}</span>
            </div>
          </div>
        </div>
      </section>      {/* Features Section avec animations avancées */}
      <section 
        data-section="features"
        className="py-20 lg:py-32 bg-white intersect-fade"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 - Timer */}
            <div className="group relative animate-fade-in-up delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift border hover:border-blue-200">
                {/* Icône avec animation */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
                    <Clock className="w-8 h-8 text-blue-600 group-hover:animate-spin transition-transform duration-1000" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {t('home.features.timer.title')}
                </h3>
                
                <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  {t('home.features.timer.description')}
                </p>
                
                <ul className="space-y-3">
                  {[t('home.features.timer.benefit1'), t('home.features.timer.benefit2')].map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      <CheckCircle className={`w-4 h-4 text-green-500 mr-3 animate-bounce delay-${index * 100}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                {/* Barre de progression simulée */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-gray-600">Session active</span>
                    <span className="text-blue-600 font-bold animate-pulse">01:23:45</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 group-hover:w-3/4" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Calendar */}
            <div className="group relative animate-fade-in-up delay-500">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift border hover:border-green-200">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
                    <Calendar className="w-8 h-8 text-green-600 group-hover:animate-bounce transition-transform duration-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  {t('home.features.calendar.title')}
                </h3>
                
                <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  {t('home.features.calendar.description')}
                </p>
                
                <ul className="space-y-3">
                  {[t('home.features.calendar.benefit1'), t('home.features.calendar.benefit2')].map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      <CheckCircle className={`w-4 h-4 text-green-500 mr-3 animate-bounce delay-${index * 100}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                {/* Mini calendrier simulé */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors duration-300">
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                      <div key={index} className="text-center font-medium text-gray-400 p-1">{day}</div>
                    ))}
                    {Array.from({ length: 14 }, (_, index) => (
                      <div key={index} className={`text-center p-1 rounded ${
                        index === 7 ? 'bg-green-500 text-white animate-pulse' : 
                        index === 5 || index === 12 ? 'bg-blue-100 text-blue-600' : 
                        'text-gray-600 hover:bg-gray-100'
                      }`}>
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Reports */}
            <div className="group relative animate-fade-in-up delay-700 md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift border hover:border-purple-200">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
                    <BarChart3 className="w-8 h-8 text-purple-600 group-hover:animate-pulse transition-transform duration-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {t('home.features.reports.title')}
                </h3>
                
                <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  {t('home.features.reports.description')}
                </p>
                
                <ul className="space-y-3">
                  {[t('home.features.reports.benefit1'), t('home.features.reports.benefit2')].map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      <CheckCircle className={`w-4 h-4 text-green-500 mr-3 animate-bounce delay-${index * 100}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                {/* Graphique simulé */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors duration-300">
                  <div className="flex items-end space-x-2 h-16">
                    {[40, 60, 35, 80, 55, 90, 45].map((height, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-t from-purple-500 to-violet-500 rounded-t flex-1 transition-all duration-1000 hover:scale-y-125"
                        style={{ 
                          height: `${height}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-2">Productivité cette semaine</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action au milieu */}
          <div className="text-center mt-16 animate-fade-in-up delay-1000">            <Link 
              href="/product"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:shadow-2xl transition-all duration-300 hover-lift group"
            >
              {t('home.features.cta')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>      {/* CTA Section finale avec animations ultra-modernes */}
      <section className="py-20 relative overflow-hidden">
        {/* Fond animé avec gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 animate-gradient"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Particules animées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-300">
              {t('home.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
              <Link
                href="/signup"
                className="group relative overflow-hidden bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {t('home.cta.start')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t('home.cta.start')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </Link>
              
              <Link
                href="/product"
                className="group inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg backdrop-blur-sm hover-lift"
              >
                {t('home.cta.learn')}
              </Link>
            </div>
              {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up delay-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{t('home.cta.stats.trial.number')}</div>
                <div className="text-blue-200 text-sm">{t('home.cta.stats.trial.label')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{t('home.cta.stats.setup.number')}</div>
                <div className="text-blue-200 text-sm">{t('home.cta.stats.setup.label')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{t('home.cta.stats.support.number')}</div>
                <div className="text-blue-200 text-sm">{t('home.cta.stats.support.label')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Vidéo ultra-moderne */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-5xl mx-auto animate-scale-in">            {/* Bouton de fermeture */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-all duration-200 z-10 group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                <X className="w-6 h-6" />
              </div>
            </button>
            
            {/* Titre de la vidéo */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t('home.video.title')}</h3>
              <p className="text-gray-300">{t('home.video.subtitle')}</p>
            </div>
            
            {/* Container vidéo avec bordure animée */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
                <video
                  ref={videoRef}
                  className="w-full h-auto max-h-[70vh] rounded-xl"
                  controls
                  autoPlay
                  preload="metadata"
                  poster="/assets/images/video-thumbnail.jpg"
                >
                  <source src="/assets/videos/demo-general.mp4" type="video/mp4" />
                  <track kind="captions" src="/assets/videos/demo-general.vtt" srcLang="fr" label="Français" />
                  Votre navigateur ne supporte pas la balise vidéo.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}