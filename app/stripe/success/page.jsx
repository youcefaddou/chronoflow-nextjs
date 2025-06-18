'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function StripeSuccessContent() {
	const searchParams = useSearchParams()
	const sessionId = searchParams.get('session_id')
	const [status, setStatus] = useState('loading') // loading, success, error
	const [subscriptionData, setSubscriptionData] = useState(null)

	useEffect(() => {
		if (sessionId) {
			verifyPaymentAndUpdateSubscription()
		} else {
			setStatus('error')
		}
	}, [sessionId])

	const verifyPaymentAndUpdateSubscription = async () => {
		try {
			// Déclencher la vérification et mise à jour de l'abonnement
			const response = await fetch('/api/stripe/verify-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ sessionId }),
			})

			if (response.ok) {
				const result = await response.json()
				if (result.success) {
					setSubscriptionData(result.session)
					setStatus('success')
				} else {
					setStatus('error')
				}
			} else {
				setStatus('error')
			}
		} catch (error) {
			console.error('Erreur lors de la vérification du paiement:', error)
			setStatus('error')
		}
	}

	if (status === 'loading') {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="flex flex-col items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Vérification du paiement...
						</h2>
						<p className="text-gray-600 text-center">
							Nous activons votre abonnement ChronoFlow Pro
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (status === 'error') {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="flex flex-col items-center justify-center py-8">
						<AlertCircle className="h-8 w-8 text-red-600 mb-4" />
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Erreur de vérification
						</h2>
						<p className="text-gray-600 text-center mb-4">
							Nous n'avons pas pu vérifier votre paiement. Veuillez contacter le support.
						</p>
						<Link href="/dashboard/subscription">
							<Button variant="outline">
								Retour aux abonnements
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<Check className="h-6 w-6 text-green-600" />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						🎉 Paiement réussi !
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<p className="text-gray-600">
						Félicitations ! Votre abonnement ChronoFlow Pro a été activé avec succès.
					</p>

					{subscriptionData && (
						<div className="bg-blue-50 p-4 rounded-lg text-left space-y-2">
							<h3 className="font-semibold text-gray-900">Détails de votre abonnement :</h3>
							<p className="text-sm text-gray-700">Plan : ChronoFlow Pro</p>
							<p className="text-sm text-gray-700">Prix : 9,99€/mois</p>
							<p className="text-sm text-gray-700">
								Email : {subscriptionData.customer_details?.email}
							</p>
						</div>
					)}

					<div className="bg-blue-50 p-4 rounded-lg">
						<h3 className="font-semibold text-gray-900 mb-2">
							🚀 Profitez de vos fonctionnalités Pro :
						</h3>
						<ul className="text-sm text-gray-700 space-y-1 text-left">
							<li>• Tâches et projets illimités</li>
							<li>• Intégration calendrier avancée</li>
							<li>• Rapports et statistiques détaillés</li>
							<li>• Mode focus avancé</li>
							<li>• Support prioritaire</li>
						</ul>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						<Link href="/dashboard" className="flex-1">
							<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
								Accéder au Dashboard Pro
							</Button>
						</Link>
						<Link href="/dashboard/subscription" className="flex-1">							<Button variant="outline" className="w-full">
								Gérer mon abonnement
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default function StripeSuccessPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		}>
			<StripeSuccessContent />
		</Suspense>
	)
}
