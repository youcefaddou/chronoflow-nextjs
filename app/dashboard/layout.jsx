'use client'

import { useState } from 'react'
import Sidebar from '../../components/dashboard/sidebar'
import GlobalTimerProvider from '../../components/timer/global-timer-provider'
import { DashboardUserProvider, useDashboardUser } from '../../contexts/dashboard-user-context'
import { TaskUpdateProvider, useTaskUpdate } from '../../contexts/task-update-context'
import I18nProvider from '../../components/i18n-provider'
import '../../styles/fullcalendar.css'

function DashboardContent({ children }) {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
	const { user, loading } = useDashboardUser()
	const { triggerUpdate } = useTaskUpdate()

	const handleMobileMenuClose = () => {
		setIsMobileSidebarOpen(false)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-600">User not connected. Redirecting...</p>
			</div>
		)
	}
	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<Sidebar 
				isMobileOpen={isMobileSidebarOpen}
				onMobileClose={handleMobileMenuClose}
				user={user}
			/>
			
			{/* Main content */}
			<main className="flex-1 overflow-auto">
				<GlobalTimerProvider onTaskUpdate={triggerUpdate}>
					{children}
				</GlobalTimerProvider>
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