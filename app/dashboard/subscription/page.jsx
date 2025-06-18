'use client'

import { useState, useEffect, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { CreditCard, Check, X, Loader2 } from 'lucide-react'
import CancelSubscription from '../../../components/subscription/cancel-subscription'

function SubscriptionContent() {
	const { t, i18n } = useTranslation()
	const searchParams = useSearchParams()
	const [isLoading, setIsLoading] = useState(false)
	const [loadingPlan, setLoadingPlan] = useState(null)
	const [userSubscription, setUserSubscription] = useState(null)
	const [subscriptionLoading, setSubscriptionLoading] = useState(true)
	// Vérifier si l'utilisateur revient de Stripe avec un session_id
	useEffect(() => {
		const sessionId = searchParams.get('session_id')
		if (sessionId) {
			verifyStripePayment(sessionId)
		} else {
			fetchSubscriptionStatus()
		}
	}, [searchParams])
	// Fonction pour vérifier le paiement Stripe et mettre à jour l'abonnement
	const verifyStripePayment = async (sessionId) => {
		try {
			const response = await fetch('/api/stripe/verify-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ sessionId }),
			})

			if (response.ok) {
				// Attendre un peu puis recharger le statut d'abonnement
				setTimeout(() => {
					fetchSubscriptionStatus()
				}, 1000)
			} else {
				fetchSubscriptionStatus()
			}
		} catch (error) {
			console.error('Erreur lors de la vérification du paiement:', error)
			fetchSubscriptionStatus()
		}
	}
	// Charger le statut d'abonnement de l'utilisateur
	const fetchSubscriptionStatus = async () => {
		try {
			const response = await fetch('/api/user/subscription')
			if (response.ok) {
				const data = await response.json()
				setUserSubscription(data.subscription)
			}
		} catch (error) {
			console.error('Erreur lors du chargement de l\'abonnement:', error)
		} finally {
			setSubscriptionLoading(false)
		}
	}

	// Gérer le succès de l'annulation d'abonnement
	const handleCancellationSuccess = (cancellationData) => {
		// Mettre à jour les données d'abonnement localement
		setUserSubscription(prev => ({
			...prev,
			status: 'canceled',
			cancel_at_period_end: true,
			current_period_end: cancellationData.subscription?.current_period_end
		}))
		
		// Recharger les données depuis le serveur pour être sûr
		setTimeout(() => {
			fetchSubscriptionStatus()
		}, 1000)
	}// Fonction pour gérer l'upgrade vers Pro
	const handleUpgrade = async (planName) => {
		// Vérifier si c'est le plan Pro (en français ou anglais)
		if (planName !== 'Pro' && planName !== t('subscription.plans.pro.name')) return
		
		setIsLoading(true)
		setLoadingPlan(planName)

		try {
			const response = await fetch('/api/stripe/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1Rb7vqIYeO7O3z9rPRYbMkCD',
				}),
			})

			const data = await response.json()
			
			if (response.ok && data.checkoutUrl) {
				// Rediriger vers Stripe Checkout
				window.location.href = data.checkoutUrl
			} else {
				console.error('Erreur:', data.error)
				toast.error(data.error || t('subscription.payment.error', 'Erreur lors de la création de la session de paiement'))
			}
		} catch (error) {
			console.error('Erreur:', error)
			toast.error(t('subscription.payment.redirectError', 'Une erreur est survenue lors de la redirection vers le paiement'))
		} finally {
			setIsLoading(false)
			setLoadingPlan(null)
		}
	}
	const plans = [
		{
			name: t('subscription.plans.free.name', 'Gratuit'),
			price: '0€',
			period: t('subscription.plans.free.period', 'toujours'),
			features: [
				t('subscription.plans.free.feature1', '5 tâches maximum'),
				t('subscription.plans.free.feature2', 'Timer de base'),
				t('subscription.plans.free.feature3', 'Rapports basiques')
			],
			limitations: [
				t('subscription.plans.free.limitation1', 'Fonctionnalités limitées'),
				t('subscription.plans.free.limitation2', 'Pas d\'intégration calendrier'),
				t('subscription.plans.free.limitation3', 'Support communautaire uniquement')
			],
			current: userSubscription?.plan === 'free' || !userSubscription?.plan
		},
		{
			name: t('subscription.plans.pro.name', 'Pro'),
			price: '9,99€',
			period: t('subscription.plans.pro.period', 'mois'),
			features: [
				t('subscription.plans.pro.feature1', 'Tâches illimitées'),
				t('subscription.plans.pro.feature2', 'Timer avancé avec mode focus'),
				t('subscription.plans.pro.feature3', 'Intégration calendrier complète'),
				t('subscription.plans.pro.feature4', 'Rapports et statistiques détaillés'),
				t('subscription.plans.pro.feature5', 'Export des données'),
				t('subscription.plans.pro.feature6', 'Notifications personnalisées'),
				t('subscription.plans.pro.feature7', 'Historique complet'),
				t('subscription.plans.pro.feature8', 'Support email prioritaire'),
				t('subscription.plans.pro.feature9', 'Sauvegarde automatique')
			],
			limitations: [],
			recommended: true,
			current: userSubscription?.plan === 'pro'
		},
		{
			name: t('subscription.plans.business.name', 'Business'),
			price: '19,99€',
			period: t('subscription.plans.business.period', 'mois'),
			features: [
				t('subscription.plans.business.feature1', 'Tout du plan Pro'),
				t('subscription.plans.business.feature2', 'Collaboration d\'équipe'),
				t('subscription.plans.business.feature3', 'Espaces de travail partagés'),
				t('subscription.plans.business.feature4', 'Contrôles administrateur'),
				t('subscription.plans.business.feature5', 'Analytics d\'équipe'),
				t('subscription.plans.business.feature6', 'Support prioritaire')
			],
			limitations: [],
			comingSoon: true
		}
	]

	return (
		<div className="h-full bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<CreditCard className="h-8 w-8 text-blue-600" />
						{t('subscription.title')}
					</h1>
					<p className="text-gray-600 mt-2">
						{t('subscription.subtitle')}
					</p>
				</div>				{/* Current Plan */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-gray-900">
							{t('subscription.currentPlan')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{subscriptionLoading ? (
							<div className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>{t('subscription.loading')}</span>
							</div>
						) : (							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-4">
										<Badge 
											variant={userSubscription?.plan === 'pro' ? "default" : "secondary"} 
											className={`text-lg px-4 py-2 ${userSubscription?.plan === 'pro' 
												? 'bg-blue-600 text-white border-0' 
												: 'bg-gray-200 text-gray-800 border-0'
											}`}
										>
											{userSubscription?.plan === 'pro' ? t('subscription.plans.pro.name') : t('subscription.plans.free.name')}
										</Badge>
										<span className="text-gray-700">
											{userSubscription?.plan === 'pro' 
												? t('subscription.currentProMessage')
												: t('subscription.currentFreeMessage')
											}
										</span>
									</div>
									{userSubscription?.plan === 'pro' && userSubscription?.currentPeriodEnd && (
										<span className="text-sm text-gray-600">
											({t('subscription.renewedOn')} {new Date(userSubscription.currentPeriodEnd).toLocaleDateString(
												i18n.language === 'en' ? 'en-US' : 'fr-FR'
											)})
										</span>
									)}
								</div>								<Button 
									variant="outline" 
									size="sm"
									onClick={() => fetchSubscriptionStatus()}
									disabled={subscriptionLoading}
									className="text-gray-900 hover:text-gray-700 border-gray-300 hover:border-gray-400"
								>
									{subscriptionLoading ? (
										<><Loader2 className="h-4 w-4 animate-spin mr-2" />{t('subscription.updating')}</>
									) : (
										t('subscription.refresh')
									)}
								</Button>
							</div>
						)}
								{/* Composant d'annulation d'abonnement - Affiché seulement si l'utilisateur a un abonnement Pro actif */}
						{!subscriptionLoading && userSubscription && userSubscription.plan === 'pro' && userSubscription.status === 'active' && (
							<div className="mt-6 pt-6 border-t border-gray-200">
								<CancelSubscription 
									subscriptionData={userSubscription}
									onCancellationSuccess={handleCancellationSuccess}
								/>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Plans Comparison */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{plans.map((plan, index) => (
						<Card 
							key={index} 
							className={`relative ${plan.recommended ? 'border-blue-500 border-2' : ''} ${plan.current ? 'bg-blue-50 border-blue-300' : ''}`}
						>							{plan.recommended && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<Badge className="bg-blue-600 text-white border-0 px-4 py-1 shadow-md">
										{t('subscription.recommended')}
									</Badge>
								</div>
							)}
							{plan.comingSoon && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 px-4 py-1 shadow-sm">
										{t('subscription.comingSoon')}
									</Badge>
								</div>
							)}
							{plan.current && (
								<div className="absolute -top-4 right-4">
									<Badge className="bg-green-600 text-white border-0 px-3 py-1 shadow-md">
										{t('subscription.current')}
									</Badge>
								</div>
							)}
									<CardHeader className="text-center">
								<CardTitle className="text-2xl font-bold text-gray-900">
									{plan.name}
								</CardTitle>
								<div className="text-4xl font-bold text-blue-600">
									{plan.price}
									<span className="text-sm text-gray-600 font-normal">
										/{plan.period}
									</span>
								</div>
							</CardHeader>
									<CardContent>
								{/* Features */}
								<div className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-3">{t('subscription.features')}</h4>
									<ul className="space-y-2">
										{plan.features.map((feature, i) => (
											<li key={i} className="flex items-start gap-2">
												<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span className="text-sm text-gray-800">{feature}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Limitations */}
								{plan.limitations.length > 0 && (
									<div className="mb-6">
										<h4 className="font-semibold text-gray-900 mb-3">{t('subscription.limitations')}</h4>
										<ul className="space-y-2">
											{plan.limitations.map((limitation, i) => (
												<li key={i} className="flex items-start gap-2">
													<X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
													<span className="text-sm text-gray-800">{limitation}</span>
												</li>
											))}
										</ul>
									</div>
								)}								{/* Action Button */}
								<div className="mt-6">
									{plan.current ? (
										<Button disabled className="w-full bg-gray-300 text-gray-700 cursor-not-allowed border border-gray-400">
											{t('subscription.currentPlanButton')}
										</Button>
									) : plan.comingSoon ? (
										<Button disabled variant="outline" className="w-full border-gray-300 text-gray-600 cursor-not-allowed">
											{t('subscription.comingSoon')}
										</Button>
									) : plan.name === t('subscription.plans.free.name') ? (
										<Button disabled variant="outline" className="w-full border-gray-300 text-gray-600 cursor-not-allowed">
											{t('subscription.freePlan')}
										</Button>
									) : (
										<Button 
											onClick={() => handleUpgrade(plan.name)}
											disabled={isLoading}
											className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
										>
											{loadingPlan === plan.name ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													{t('subscription.redirecting')}
												</>
											) : (
												t('subscription.upgradeButton', { plan: plan.name })
											)}
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>				{/* Additional Info */}
				<Card className="mt-8">
					<CardContent className="pt-6">
						<div className="text-center text-gray-700">
							<p className="mb-2">
								{t('subscription.additionalInfo')}
							</p>
							<p className="text-sm text-gray-600">
								{t('subscription.cancellationInfo')}							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default function SubscriptionPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		}>
			<SubscriptionContent />
		</Suspense>
	)
}