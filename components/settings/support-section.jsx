'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HelpCircle, Mail, FileText, ExternalLink, Send } from 'lucide-react'

export default function SupportSection() {
  const { t } = useTranslation()
  const [showContactForm, setShowContactForm] = useState(false)
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

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
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
        body: JSON.stringify(contactForm)
      })

      if (response.ok) {
        setContactForm({ subject: '', message: '', email: '' })
        setShowContactForm(false)
        showMessage(
          t('settings.items.contactSuccess') || 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
          'success'
        )
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending contact message:', error)
      showMessage(
        t('settings.items.contactError') || 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const supportLinks = [
    {
      title: t('settings.items.faq'),
      description: t('settings.items.faqDesc') || 'Trouvez des réponses aux questions fréquemment posées',
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      action: () => window.open('/faq', '_blank'),
      external: true
    },
    {
      title: t('settings.items.documentation'),
      description: t('settings.items.documentationDesc') || 'Consultez la documentation complète de ChronoFlow',
      icon: <FileText className="h-5 w-5 text-green-600" />,
      action: () => window.open('/docs', '_blank'),
      external: true
    },
    {
      title: t('settings.items.contactSupport'),
      description: t('settings.items.contactSupportDesc') || 'Contactez notre équipe de support pour obtenir de l\'aide',
      icon: <Mail className="h-5 w-5 text-purple-600" />,
      action: () => setShowContactForm(true),
      external: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Message */}
      {submitMessage && (
        <div className={`rounded-md p-3 ${
          submitMessageType === 'success' ? 'bg-green-50 border border-green-200' :
          submitMessageType === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm ${
            submitMessageType === 'success' ? 'text-green-700' :
            submitMessageType === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {submitMessage}
          </p>
        </div>
      )}

      {/* Support Options */}
      <div className="grid gap-4">
        {supportLinks.map((link, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              {link.icon}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  {link.title}
                  {link.external && <ExternalLink className="h-4 w-4 text-gray-400" />}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {link.description}
                </p>
                <button
                  onClick={link.action}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                >
                  {link.external 
                    ? (t('settings.items.openLink') || 'Ouvrir')
                    : (t('settings.items.openForm') || 'Contacter')
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('settings.items.contactSupport')}
              </h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.items.email')} {t('common.optional') && `(${t('common.optional')})`}
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('settings.items.emailPlaceholder') || 'votre@email.com'}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.items.subject')} *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('settings.items.subjectPlaceholder') || 'Objet de votre message'}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.items.message')} *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('settings.items.messagePlaceholder') || 'Décrivez votre question ou problème...'}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting 
                    ? (t('settings.items.sending') || 'Envoi...')
                    : (t('settings.items.sendMessage') || 'Envoyer')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  {t('common.cancel') || 'Annuler'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
