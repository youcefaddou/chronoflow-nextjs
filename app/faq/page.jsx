'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function FAQPage() {
  const { t } = useTranslation()
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Generate FAQ items from translations
  const faqItems = []
  for (let i = 1; i <= 12; i++) {
    faqItems.push({
      question: t(`faq.question${i}`),
      answer: t(`faq.answer${i}`)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('faq.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openItems[index] ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openItems[index] && (
                  <div className="px-6 pb-4">
                    <div className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4 text-lg">
              {t('faq.noAnswer')}
            </p>
            <p className="text-gray-500 mb-6">
              {t('faq.contactTeam')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('faq.contactButton')}
              </Link>
              <a 
                href="mailto:contact.chronoflow@gmail.com" 
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                contact.chronoflow@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}