'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		// Retourner des valeurs par défaut si le contexte n'est pas disponible
		return { user: null, loading: false, setUser: () => {} }
	}
	return context
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [isHydrated, setIsHydrated] = useState(false)
	
	useEffect(() => {
		// Marquer que l'hydratation est terminée
		setIsHydrated(true)
		
		const getUser = async () => {
			try {
				const res = await fetch('/api/auth/session', { 
					credentials: 'include' 
				})
				if (res.ok) {
					const userData = await res.json()
					setUser(userData)
				} else {
					setUser(null)
				}
			} catch (err) {
				console.error('Error fetching user:', err)
				setUser(null)
			} finally {
				setLoading(false)
			}
		}
		getUser()
	}, [])

	const value = {
		user,
		setUser,
		loading: loading || !isHydrated // Garder loading=true jusqu'à hydratation
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
