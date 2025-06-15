'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DashboardUserContext = createContext()

export function useDashboardUser() {
	const context = useContext(DashboardUserContext)
	if (!context) {
		throw new Error('useDashboardUser must be used within a DashboardUserProvider')
	}
	return context
}

export function DashboardUserProvider({ children }) {
	const router = useRouter()
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch('/api/auth/session', {
					credentials: 'include'
				})
				if (res.ok) {
					const data = await res.json()
					
					// L'API retourne { user: { id, email, username } }
					setUser(data.user || data)
				} else {
					setUser(null)
					router.push('/login')
				}
			} catch (err) {
				console.error('DashboardUserContext: Error fetching user:', err)
				setUser(null)
				router.push('/login')
			} finally {
				setLoading(false)
			}
		}
		getUser()
	}, [router])

	const value = {
		user,
		setUser,
		loading
	}

	return (
		<DashboardUserContext.Provider value={value}>
			{children}
		</DashboardUserContext.Provider>
	)
}
