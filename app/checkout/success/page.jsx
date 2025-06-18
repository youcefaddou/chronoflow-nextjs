'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationState, setVerificationState] = useState('loading')
  const [sessionData, setSessionData] = useState(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setVerificationState('error')
      return
    }

    // Vérifier le paiement côté serveur
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setSessionData(data.session)
          setVerificationState('success')
        } else {
          setVerificationState('error')
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error)
        setVerificationState('error')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (verificationState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vérification de votre paiement...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous confirmons votre abonnement.
          </p>
        </div>
      </div>
    )
  }

  if (verificationState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de vérification
          </h2>
          <p className="text-gray-600 mb-6">
            Une erreur s'est produite lors de la vérification de votre paiement.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard/subscription"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retourner aux abonnements
            </Link>
            <Link
              href="/contact"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contacter le support
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Paiement réussi !
        </h1>
        <p className="text-gray-600 mb-6">
          Félicitations ! Votre abonnement ChronoFlow Pro a été activé avec succès.
        </p>
        
        {sessionData && (
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Détails de votre abonnement :</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Plan :</span> ChronoFlow Pro</p>
              <p><span className="font-medium">Prix :</span> 9,99€/mois</p>
              <p><span className="font-medium">Email :</span> {sessionData.customer_details?.email}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Accéder au Dashboard Pro
          </Link>
          <Link
            href="/dashboard/subscription"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Gérer mon abonnement
          </Link>
        </div>        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🚀 Profitez de vos fonctionnalités Pro :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tâches et projets illimités</li>
            <li>• Intégration calendrier avancée</li>
            <li>• Rapports et statistiques détaillés</li>
            <li>• Mode focus avancé</li>
            <li>• Support prioritaire</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
