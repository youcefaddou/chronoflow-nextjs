'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full h-12 w-12 bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Paiement annulé
        </h1>
        <p className="text-gray-600 mb-6">
          Vous avez annulé le processus de paiement. Aucun montant n'a été prélevé.
        </p>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Que faire maintenant ?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Vous pouvez continuer à utiliser ChronoFlow avec le plan gratuit ou essayer de nouveau le paiement plus tard.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Rappel : Avec ChronoFlow Pro</h4>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Tâches et projets illimités</li>
              <li>• Intégration calendrier avancée</li>
              <li>• Rapports et statistiques détaillés</li>
              <li>• Mode focus avancé</li>
              <li>• Support prioritaire</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard/subscription"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Réessayer le paiement
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continuer avec le plan gratuit
          </Link>
          <Link
            href="/pricing"
            className="block w-full text-blue-600 py-2 px-4 hover:underline"
          >
            Voir tous les plans
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Des questions ? 
            <Link href="/contact" className="text-blue-600 hover:underline ml-1">
              Contactez notre équipe support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
