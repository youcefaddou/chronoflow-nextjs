'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "Qu'est-ce que ChronoFlow ?",
    answer: "ChronoFlow est une application de gestion du temps qui vous aide à suivre vos activités, analyser votre productivité et optimiser votre emploi du temps."
  },
  {
    question: "Comment puis-je commencer à utiliser ChronoFlow ?",
    answer: "Inscrivez-vous avec votre email ou connectez-vous avec Google, puis créez votre premier projet et commencez à enregistrer vos activités."
  },
  {
    question: "Puis-je intégrer ChronoFlow avec d'autres applications ?",
    answer: "Oui, ChronoFlow s'intègre avec Google Calendar et d'autres outils de productivité pour synchroniser vos données."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Nous utilisons des protocoles de sécurité avancés pour protéger vos données personnelles et professionnelles."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-lg text-gray-600">
              Trouvez les réponses aux questions les plus courantes sur ChronoFlow
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openItems[index] ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openItems[index] && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Contactez-nous
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}