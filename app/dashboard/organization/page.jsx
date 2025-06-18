'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Users, Clock } from 'lucide-react'

export default function OrganizationPage() {
	const { t } = useTranslation()

	return (
		<div className="h-full bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<Users className="h-8 w-8 text-blue-600" />
						{t('sidebar.organization') || 'Organization'}
					</h1>
					<p className="text-gray-600 mt-2">
						{t('organization.description') || 'Manage your team and organization settings'}
					</p>
				</div>

				{/* Coming Soon Card */}
				<Card className="text-center py-16">
					<CardHeader>
						<div className="flex justify-center mb-4">
							<div className="p-4 bg-blue-100 rounded-full">
								<Clock className="h-12 w-12 text-blue-600" />
							</div>
						</div>
						<CardTitle className="text-2xl text-gray-900">
							{t('organization.comingSoon.title') || 'Bientôt disponible'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600 text-lg max-w-md mx-auto">
							{t('organization.comingSoon.description') || 
								'La gestion d\'équipe et d\'organisation sera disponible très prochainement. Restez connecté !'}
						</p>
						<div className="mt-8">
							<p className="text-sm text-gray-500">
								{t('organization.comingSoon.english') || 'Coming soon - Team and organization management will be available very soon. Stay tuned!'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>	)
}
