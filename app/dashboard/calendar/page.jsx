'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import CalendarView from '../../../components/calendar/calendar-view'
import { Calendar as CalendarIcon } from 'lucide-react'

export default function CalendarPage() {
	const { t } = useTranslation()

	return (
		<div className="h-full bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<CalendarIcon className="h-8 w-8 text-blue-600" />
						{t('calendar.title') || 'Calendar'}
					</h1>
					<p className="text-gray-600 mt-2">
						{t('calendar.description') || 'Manage your events and schedule'}
					</p>
				</div>

				{/* Calendar */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarIcon className="h-5 w-5 text-blue-600" />
							{t('calendar.title') || 'Calendar'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CalendarView />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
