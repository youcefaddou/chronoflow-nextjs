'use client'

import { useState } from 'react'
import Sidebar from '../../components/dashboard/sidebar'
import GlobalTimerProvider from '../../components/timer/global-timer-provider'
import { DashboardUserProvider, useDashboardUser } from '../../contexts/dashboard-user-context'
import { TaskUpdateProvider, useTaskUpdate } from '../../contexts/task-update-context'
import I18nProvider from '../../components/i18n-provider'
import { LoadingScreen } from '../../components/ui/loading-components'
import { ErrorMessage } from '../../components/ui/error-components'
import '../../styles/fullcalendar.css'

function DashboardContent({ children }) {
	const { user, loading, error } = useDashboardUser()
	const { triggerUpdate } = useTaskUpdate()

	if (loading) {
		return <LoadingScreen message="Loading your dashboard..." />
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<ErrorMessage
					title="Dashboard Error"
					message="Unable to load your dashboard. Please try again."
					onRetry={() => window.location.reload()}
					onGoHome={() => window.location.href = '/'}
				/>
			</div>
		)
	}

	if (!user) {
		return <LoadingScreen message="Redirecting to login..." />
	}	
	return (
		<div className="dashboard-container">
			{/* Sidebar */}
			<Sidebar user={user} />
			
			{/* Main content */}
			<main className="flex-1 flex flex-col overflow-hidden">
				{/* Content area */}
				<div className="flex-1 overflow-auto bg-gray-50">
					<GlobalTimerProvider onTaskUpdate={triggerUpdate}>
						{children}
					</GlobalTimerProvider>
				</div>
			</main>
		</div>
	)
}

export default function DashboardLayout({ children }) {
	return (
		<I18nProvider>
			<TaskUpdateProvider>
				<GlobalTimerProvider>
					<DashboardUserProvider>
						<DashboardContent>
							{children}
						</DashboardContent>
					</DashboardUserProvider>
				</GlobalTimerProvider>
			</TaskUpdateProvider>
		</I18nProvider>
	)
}