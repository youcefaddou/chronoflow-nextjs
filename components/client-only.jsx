'use client'

import { useState, useEffect } from 'react'

export default function ClientOnly({ children, fallback = null }) {
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		setIsHydrated(true)
	}, [])

	if (!isHydrated) {
		return fallback
	}

	return children
}
