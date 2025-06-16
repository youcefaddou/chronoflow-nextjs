'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import FullCalendarGrid from './full-calendar-grid'

function CalendarView({ user, refreshKey, lastSavedTaskId, lastSavedDuration, onRefresh, onEventsRefetch }) {
	const { t } = useTranslation()

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">
					{t('dashboard.calendar.title', 'Calendrier')}
				</h1>
			</div>
			
			<FullCalendarGrid
				user={user}
				refreshKey={refreshKey}
				lastSavedTaskId={lastSavedTaskId}
				lastSavedDuration={lastSavedDuration}
				onRefresh={onRefresh}
				onEventsRefetch={onEventsRefetch}
			/>
		</div>
	)
}

export default CalendarView
