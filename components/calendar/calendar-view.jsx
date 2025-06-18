'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import FullCalendarGrid from './full-calendar-grid'

function CalendarView({ user, refreshKey, lastSavedTaskId, lastSavedDuration, onRefresh, onEventsRefetch }) {
	const { t } = useTranslation()
	return (
		<div className="space-y-6">
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
