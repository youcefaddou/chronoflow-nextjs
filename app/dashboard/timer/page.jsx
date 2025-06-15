'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import GlobalTimer from '../../../components/timer/global-timer'
import TaskListView from '../../../components/tasks/task-list-view'
import { Timer, Clock, BarChart3 } from 'lucide-react'

export default function TimerPage() {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState('timer')

	return (
		<div className="h-full bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<Timer className="h-8 w-8 text-blue-600" />
						{t('sidebar.timer') || 'Timer'}
					</h1>
					<p className="text-gray-600 mt-2">
						{t('timer.description') || 'Manage your time and track your productivity'}
					</p>
				</div>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="timer" className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							{t('timer.tab.timer') || 'Timer'}
						</TabsTrigger>
						<TabsTrigger value="tasks" className="flex items-center gap-2">
							<Timer className="h-4 w-4" />
							{t('timer.tab.tasks') || 'Tasks'}
						</TabsTrigger>
						<TabsTrigger value="stats" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							{t('timer.tab.stats') || 'Statistics'}
						</TabsTrigger>
					</TabsList>

					{/* Timer Tab */}
					<TabsContent value="timer" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Main Timer */}
							<Card className="lg:col-span-2">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Clock className="h-5 w-5 text-blue-600" />
										{t('timer.main.title') || 'Main Timer'}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<GlobalTimer />
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Tasks Tab */}
					<TabsContent value="tasks" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Timer className="h-5 w-5 text-blue-600" />
									{t('task.list.title') || 'Task List'}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<TaskListView />
							</CardContent>
						</Card>
					</TabsContent>

					{/* Statistics Tab */}
					<TabsContent value="stats" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="h-5 w-5 text-blue-600" />
									{t('timer.stats.title') || 'Time Statistics'}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-12 text-gray-500">
									<BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
									<h3 className="text-lg font-medium mb-2">
										{t('timer.stats.comingSoon') || 'Statistics Coming Soon'}
									</h3>
									<p className="text-sm">
										{t('timer.stats.description') || 'Track your productivity with detailed time analytics'}
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
