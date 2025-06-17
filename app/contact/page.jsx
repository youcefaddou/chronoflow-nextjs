'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Mail, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  const { t, i18n } = useTranslation()
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitMessageType, setSubmitMessageType] = useState('')

  const showMessage = (text, type = 'info') => {
    setSubmitMessage(text)
    setSubmitMessageType(type)
    setTimeout(() => {
      setSubmitMessage('')
      setSubmitMessageType('')
    }, 5000)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!contactForm.subject.trim() || !contactForm.message.trim() || !contactForm.email.trim()) {
      showMessage(
        t('settings.items.contactFormError') || 'Veuillez remplir tous les champs',
        'error'
      )
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactForm,
          language: i18n.language || 'fr'
        })
      })

      const responseData = await response.json()

      if (response.ok) {
        showMessage(
          responseData.message || t('settings.items.contactSuccess') || 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
          'success'
        )
        setContactForm({ subject: '', message: '', email: '' })
      } else {
        throw new Error(responseData.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      showMessage(
        error.message || t('settings.items.contactError') || 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.contactInfo')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <a 
                      href="mailto:contact.chronoflow@gmail.com"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      contact.chronoflow@gmail.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('contact.emailDescription')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MessageCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                    <Link 
                      href="/faq"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {t('contact.consultFaq')}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('contact.faqDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.sendMessage')}
              </h2>
              
              {submitMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitMessageType === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('settings.items.emailPlaceholder') || 'votre@email.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('settings.items.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder={t('settings.items.subjectPlaceholder') || 'Sujet de votre message'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('settings.items.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={t('settings.items.messagePlaceholder') || 'Décrivez votre question ou problème...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (t('settings.items.sending') || 'Envoi...')
                    : (t('settings.items.sendMessage') || 'Envoyer')
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
