import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// Fonction pour les middlewares Express (existante)
export function auth (req, res, next) {
	const token = req.cookies.token
	if (!token) {
		return res.redirect('http://localhost:3030/login')
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded
		next()
	} catch {
		return res.redirect('http://localhost:3030/login')
	}
}

// Fonction pour les API routes Next.js
export async function verifyAuth() {	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('token')?.value
		
		if (!token) {
			return { isAuthenticated: false, error: 'Token manquant' }
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		return { 
			isAuthenticated: true, 
			user: decoded 
		}	} catch {
		return { 
			isAuthenticated: false, 
			error: 'Token invalide' 
		}
	}
}
