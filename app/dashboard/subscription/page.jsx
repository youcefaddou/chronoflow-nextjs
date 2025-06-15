'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { CreditCard, Check, X } from 'lucide-react'

export default function SubscriptionPage() {
	const { t } = useTranslation()

	const plans = [
		{
			name: 'Free',
			price: '0€',
			period: 'month',
			features: [
				'Basic time tracking',
				'Up to 5 tasks',
				'Local storage',
				'Basic reports'
			],
			limitations: [
				'No Google Calendar sync',
				'No team collaboration',
				'Limited history'
			],
			current: true
		},
		{
			name: 'Pro',
			price: '9.99€',
			period: 'month',
			features: [
				'Unlimited time tracking',
				'Unlimited tasks',
				'Google Calendar sync',
				'Advanced reports',
				'Export capabilities',
				'Priority support'
			],
			limitations: [],
			recommended: true
		},
		{
			name: 'Team',
			price: '19.99€',
			period: 'month',
			features: [
				'Everything in Pro',
				'Team collaboration',
				'Shared workspaces',
				'Admin controls',
				'Team analytics',
				'API access'
			],
			limitations: []
		}
	]

	return (
		<div className="h-full bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<CreditCard className="h-8 w-8 text-blue-600" />
						{t('sidebar.subscription') || 'Subscription'}
					</h1>
					<p className="text-gray-600 mt-2">
						{t('subscription.description') || 'Choose the plan that fits your needs'}
					</p>
				</div>

				{/* Current Plan */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>
							{t('subscription.current') || 'Current Plan'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<Badge variant="secondary" className="text-lg px-4 py-2">
								Free Plan
							</Badge>
							<span className="text-gray-600">
								{t('subscription.freeDescription') || 'You are currently on the free plan'}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Plans */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{plans.map((plan) => (
						<Card key={plan.name} className={`relative ${plan.recommended ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
							{plan.recommended && (
								<Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
									{t('subscription.recommended') || 'Recommended'}
								</Badge>
							)}
							
							<CardHeader className="text-center">
								<CardTitle className="text-2xl">{plan.name}</CardTitle>
								<div className="text-3xl font-bold text-blue-600">
									{plan.price}
									<span className="text-sm text-gray-500 font-normal">
										/{t('subscription.month') || 'month'}
									</span>
								</div>
							</CardHeader>
							
							<CardContent className="space-y-4">
								{/* Features */}
								<div className="space-y-2">
									<h4 className="font-semibold text-green-700">
										{t('subscription.included') || 'Included:'}
									</h4>
									{plan.features.map((feature, index) => (
										<div key={index} className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span className="text-sm">{feature}</span>
										</div>
									))}
								</div>

								{/* Limitations */}
								{plan.limitations.length > 0 && (
									<div className="space-y-2">
										<h4 className="font-semibold text-red-700">
											{t('subscription.limitations') || 'Limitations:'}
										</h4>
										{plan.limitations.map((limitation, index) => (
											<div key={index} className="flex items-center gap-2">
												<X className="h-4 w-4 text-red-500" />
												<span className="text-sm text-gray-600">{limitation}</span>
											</div>
										))}
									</div>
								)}

								{/* Action Button */}
								<div className="pt-4">
									{plan.current ? (
										<Button disabled className="w-full">
											{t('subscription.current') || 'Current Plan'}
										</Button>
									) : (
										<Button 
											className={`w-full ${plan.recommended ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
											variant={plan.recommended ? 'default' : 'outline'}
										>
											{t('subscription.upgrade') || 'Upgrade'} to {plan.name}
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Features Comparison */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>
							{t('subscription.comparison') || 'Feature Comparison'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8 text-gray-500">
							<CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>
								{t('subscription.detailedComparison') || 'Detailed feature comparison coming soon'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
