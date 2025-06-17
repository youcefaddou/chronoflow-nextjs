'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Check, Star, Zap, Users, ChevronDownIcon } from 'lucide-react'

export default function PricingPage() {
  const { t } = useTranslation()
  const [isYearly, setIsYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState({})

  const toggleFaq = (index) => {
    setOpenFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  // Helper function to get features for each plan
  const getFeatures = (planId, count) => {
    const features = []
    for (let i = 1; i <= count; i++) {
      const feature = t(`pricing.${planId}.feature${i}`)
      if (feature && feature !== `pricing.${planId}.feature${i}`) {
        features.push(feature)
      }
    }
    return features.length > 0 ? features : getDefaultFeatures(planId)
  }

  // Fallback features if translations are not available
  const getDefaultFeatures = (planId) => {
    const defaultFeatures = {
      free: [
        "Suivi du temps jusqu'à 3 projets",
        "Chronomètre de base", 
        "Statistiques simples (journalières/hebdomadaires)",
        "Exportation CSV limitée (1x/mois)",
        "Interface responsive",
        "Historique de 30 jours"
      ],
      pro: [
        "Projets illimités",
        "Intégration Google Calendar + Outlook",
        "Rapports détaillés et personnalisés",
        "Exportation multi-formats (PDF, CSV, JSON)",
        "Historique complet",
        "Facturation automatique par projet",
        "Support email prioritaire",
        "Sauvegarde automatique"
      ],
      business: [
        "Toutes les fonctionnalités Pro",
        "Collaboration d'équipe (jusqu'à 10 membres)",
        "Gestion des rôles et permissions",
        "Tableau de bord manager",
        "Intégrations avancées (Slack, Trello, Asana)",
        "API REST complète",
        "Support chat en direct",
        "Rapports d'équipe et analytics avancés"
      ]
    }
    return defaultFeatures[planId] || []
  }

  const plans = [
    {
      id: 'free',
      name: t('pricing.free.title'),
      description: t('pricing.free.description'),
      price: t('pricing.free.price'),
      yearlyPrice: t('pricing.free.price'),      features: getFeatures('free', 6),
      cta: t('pricing.getStarted'),
      popular: false,
      comingSoon: false,
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'pro',
      name: t('pricing.pro.title'),
      description: t('pricing.pro.description'),
      price: t('pricing.pro.monthlyPrice'),
      yearlyPrice: t('pricing.pro.yearlyPrice'),      features: getFeatures('pro', 8),
      cta: t('pricing.upgrade'),
      popular: true,
      comingSoon: false,
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'business',
      name: t('pricing.business.title'),
      description: t('pricing.business.description'),
      price: t('pricing.business.monthlyPrice'),
      yearlyPrice: t('pricing.business.yearlyPrice'),      features: getFeatures('business', 8),
      cta: t('pricing.contactUs'),
      popular: false,
      comingSoon: true,
      icon: <Users className="w-6 h-6" />
    }
  ]

  const faqItems = [
    {
      question: t('pricing.faq.question1'),
      answer: t('pricing.faq.answer1')
    },
    {
      question: t('pricing.faq.question2'),
      answer: t('pricing.faq.answer2')
    },
    {
      question: t('pricing.faq.question3'),
      answer: t('pricing.faq.answer3')
    },
    {
      question: t('pricing.faq.question4'),
      answer: t('pricing.faq.answer4')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              {t('pricing.yearly')}
            </span>
            {isYearly && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {t('pricing.yearlyDiscount')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              } ${plan.comingSoon ? 'opacity-90' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {t('pricing.mostPopular')}
                  </span>
                </div>
              )}
              
              {plan.comingSoon && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('pricing.comingSoon')}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    {plan.id === 'free' ? (
                      <div className="text-4xl font-bold text-gray-900">{plan.price}</div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          {isYearly ? plan.yearlyPrice : plan.price}
                        </div>
                        <div className="text-gray-500">
                          {isYearly ? t('pricing.perYear') : t('pricing.perMonth')}
                        </div>                        {isYearly && plan.id !== 'free' && (
                          <div className="text-sm text-green-600 font-medium mt-1">
                            {t('pricing.yearlySavings', { amount: plan.id === 'pro' ? '20€' : '40€' })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="text-center">
                  {plan.comingSoon ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                    >
                      {plan.cta}
                    </button>
                  ) : plan.id === 'free' ? (
                    <Link
                      href="/signup"
                      className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block text-center"
                    >
                      {plan.cta}
                    </Link>
                  ) : plan.id === 'business' ? (
                    <Link
                      href="/contact"
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block text-center"
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/subscription"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block text-center"
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('pricing.faq.title')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openFaq[index] ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq[index] && (
                  <div className="px-6 pb-4">
                    <div className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>        {/* Final CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t('pricing.finalCta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('pricing.finalCta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {t('pricing.finalCta.startFree')}
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                {t('pricing.finalCta.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
