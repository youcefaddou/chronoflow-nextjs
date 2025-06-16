'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Users, Plus, Settings, Crown } from 'lucide-react'

export default function OrganizationPage() {
	const { t } = useTranslation()

	const teamMembers = [
		{
			name: 'John Doe',
			email: 'john@example.com',
			role: 'Owner',
			avatar: 'J',
			status: 'active'
		},
		{
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'Admin',
			avatar: 'J',
			status: 'active'
		},
		{
			name: 'Mike Johnson',
			email: 'mike@example.com',
			role: 'Member',
			avatar: 'M',
			status: 'pending'
		}
	]

	return (
		<div className="h-full bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
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

				{/* Organization Info */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>{t('organization.info') || 'Organization Information'}</span>
							<Button variant="outline" size="sm">
								<Settings className="h-4 w-4 mr-2" />
								{t('organization.edit') || 'Edit'}
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-gray-600">
									{t('organization.name') || 'Organization Name'}
								</label>
								<p className="text-lg">ChronoFlow Team</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-600">
									{t('organization.plan') || 'Plan'}
								</label>
								<div className="flex items-center gap-2">
									<Badge variant="secondary">Free Plan</Badge>
									<Button variant="link" size="sm" className="p-0 h-auto">
										{t('organization.upgrade') || 'Upgrade'}
									</Button>
								</div>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-600">
									{t('organization.members') || 'Members'}
								</label>
								<p className="text-lg">3 / 5</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-600">
									{t('organization.created') || 'Created'}
								</label>
								<p className="text-lg">January 2024</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Team Members */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>{t('organization.teamMembers') || 'Team Members'}</span>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								{t('organization.inviteMember') || 'Invite Member'}
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{teamMembers.map((member, index) => (
								<div key={index} className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full flex items-center justify-center text-white font-bold">
											{member.avatar}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<h3 className="font-medium">{member.name}</h3>
												{member.role === 'Owner' && (
													<Crown className="h-4 w-4 text-yellow-500" />
												)}
											</div>
											<p className="text-sm text-gray-600">{member.email}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge variant={member.status === 'active' ? 'success' : 'secondary'}>
											{member.status === 'active' 
												? (t('organization.active') || 'Active')
												: (t('organization.pending') || 'Pending')
											}
										</Badge>
										<Badge variant="outline">
											{member.role}
										</Badge>
										{member.role !== 'Owner' && (
											<Button variant="outline" size="sm">
												{t('organization.manage') || 'Manage'}
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Organization Settings */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>
							{t('organization.settings') || 'Organization Settings'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8 text-gray-500">
							<Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>
								{t('organization.settingsDescription') || 'Advanced organization settings coming soon'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
