'use client'

import { useState, useEffect } from 'react'

export function useTasks() {
	const [tasks, setTasks] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const fetchTasks = async () => {
		setIsLoading(true)
		try {
			// Simulation - remplacer par un vrai appel API
			setTasks([])
		} catch (error) {
			console.error('Error fetching tasks:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchTasks()
	}, [])

	return {
		tasks,
		fetchTasks,
		isLoading
	}
}
