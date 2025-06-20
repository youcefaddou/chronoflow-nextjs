'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/

export default function LoginPage() {
	const { t, ready } = useTranslation()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	
	// Wait for i18n to be ready before rendering form
	const [i18nReady, setI18nReady] = useState(false)
	
	useEffect(() => {
		if (ready) {
			setI18nReady(true)
		}
	}, [ready])

	// Check for OAuth errors in URL parameters
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search)
			const oauthError = urlParams.get('error')
			
			if (oauthError) {
				switch (oauthError) {
					case 'invalid_grant':
						setError(t('auth.errors.oauthInvalidGrant') || 'Erreur d\'authentification Google. Veuillez réessayer.')
						break
					case 'google_auth_error':
						setError(t('auth.errors.googleAuthError') || 'Erreur lors de l\'authentification Google.')
						break
					case 'auth_failed':
						setError(t('auth.errors.authFailed') || 'Échec de l\'authentification.')
						break
					case 'missing_code':
						setError(t('auth.errors.missingCode') || 'Code d\'autorisation manquant.')
						break
					default:
						setError(t('auth.errors.unknown') || 'Une erreur s\'est produite lors de l\'authentification.')
				}
				
				// Clean URL without reloading the page
				window.history.replaceState({}, document.title, window.location.pathname)
			}
		}
	}, [t])
	
	// Schema de validation avec i18n - recréé à chaque rendu pour la langue
	const loginSchema = z.object({
		email: z.string().email(t('auth.login.emailInvalid') || 'Email invalide'),
		password: z
			.string()
			.min(8, t('auth.login.passwordMinLength') || 'Le mot de passe doit contenir au moins 8 caractères')
			.regex(
				passwordRegex,
				t('auth.login.passwordFormat') || 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
			),
	})
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
	})

	// Auto-check session after Google login
	useEffect(() => {
		const checkSession = async () => {
			try {
				const res = await fetch('/api/auth/session', { credentials: 'include' })
				if (res.ok) {
					router.push('/dashboard')
				}
			} finally {
				setLoading(false)
			}
		}
		checkSession()
	}, [router])

	const onSubmit = async ({ email, password }) => {
		setError('')
		setLoading(true)
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
				credentials: 'include',
			})
			const data = await res.json()
			setLoading(false)
			if (!res.ok) throw new Error(data.message || data.error || 'Login failed')
			router.push('/dashboard')
		} catch (err) {
			setLoading(false)
			setError(err.message)
		}
	}
	// Show loading screen while checking session or if i18n is not ready
	if (loading || !i18nReady) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-gray-600">
					{i18nReady ? t('auth.loading') : 'Loading...'}
				</div>
			</div>
		)
	}
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 relative overflow-hidden">
			{/* Particules de fond animées */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-300/15 rounded-full blur-2xl animate-pulse delay-500"></div>
			</div>
			
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-md relative z-10 hover:shadow-2xl transition-all duration-300">
				<h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
					{t('auth.login.title')}
				</h1>
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-4">
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="email">
							{t('auth.signup.email')}
						</label>						<input
							id="email"
							type="email"
							autoComplete="email"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white"
							{...register('email')}
							disabled={loading}
						/>
						{errors.email && (
							<p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
						)}
					</div>
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="password">
							{t('auth.login.password')}
						</label>						<input
							id="password"
							type="password"
							autoComplete="current-password"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white"
							{...register('password')}
							disabled={loading}
						/>
						{errors.password && (
							<p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>					<button
						type="submit"
						className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60 transform hover:scale-[1.02] hover:shadow-lg"
						disabled={loading}
					>
						{loading ? t('auth.login.signing') : t('auth.login.signIn')}
					</button>
				</form>
				
				{/* Google Auth */}
				<div className="mt-4">					<button
						type="button"
						onClick={() => {
							window.location.assign('/api/auth/google')
						}}
						className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] hover:shadow-md"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						{t('auth.login.googleSignIn')}
					</button>
				</div>				<div className="mt-6 text-center text-sm text-gray-600">
					{t('auth.login.noAccount')}{' '}
					<Link href="/signup" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-300">
						{t('auth.login.createAccount')}
					</Link>
				</div>
			</div>
		</div>
	)
}
