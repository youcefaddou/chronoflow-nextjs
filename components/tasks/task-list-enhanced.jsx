'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function TaskListViewEnhanced() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Tâches</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-gray-500">Liste des tâches à venir...</p>
			</CardContent>
		</Card>
	)
}
