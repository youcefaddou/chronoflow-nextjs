'use client'

import React, { createContext, useContext, useState } from 'react'

const TaskUpdateContext = createContext()

export function useTaskUpdate() {
	const context = useContext(TaskUpdateContext)
	if (!context) {
		throw new Error('useTaskUpdate must be used within TaskUpdateProvider')
	}
	return context
}

export function TaskUpdateProvider({ children }) {
	const [refreshKey, setRefreshKey] = useState(0)
	const [updateCallbacks, setUpdateCallbacks] = useState([])

	const triggerUpdate = () => {
		setRefreshKey(prev => prev + 1)
		// Exécuter tous les callbacks enregistrés
		updateCallbacks.forEach(callback => {
			if (typeof callback === 'function') {
				callback()
			}
		})
	}

	const registerCallback = (callback) => {
		setUpdateCallbacks(prev => [...prev, callback])
		
		// Retourner une fonction de nettoyage
		return () => {
			setUpdateCallbacks(prev => prev.filter(cb => cb !== callback))
		}
	}

	const value = {
		refreshKey,
		triggerUpdate,
		registerCallback
	}

	return (
		<TaskUpdateContext.Provider value={value}>
			{children}
		</TaskUpdateContext.Provider>
	)
}

export default TaskUpdateProvider
