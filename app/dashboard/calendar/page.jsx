'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import CalendarView from '../../../components/calendar/calendar-view'
import { Calendar as CalendarIcon } from 'lucide-react'

export default function CalendarPage() {
	const { t } = useTranslation()

	return (
		<div className="h-full bg-gray-50 p-3 sm:p-4 lg:p-6">
			<div className="max-w-full">
				{/* Header - Responsive */}
				<div className="mb-4 sm:mb-6 lg:mb-8">
					<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
						<CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600" />
						{t('calendar.title') || 'Calendar'}
					</h1>
					<p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
						{t('calendar.description') || 'Manage your events and schedule'}
					</p>
				</div>

				{/* Calendar - Responsive */}
				<Card className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] lg:h-[calc(100vh-16rem)]">
					<CardHeader className="pb-3 sm:pb-4">
						<CardTitle className="flex items-center gap-2 text-sm sm:text-base">
							<CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
							{t('calendar.title') || 'Calendar'}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-2 sm:p-4 lg:p-6 h-full">
						<div className="h-full">
							<CalendarView />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
