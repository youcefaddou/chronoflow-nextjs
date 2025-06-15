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
	const { t } = useTranslation()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	
	// Schema de validation avec i18n - recréé à chaque rendu pour la langue
	const loginSchema = z.object({
		email: z.string().email(t('auth.signup.email') + ' invalide'),
		password: z
			.string()
			.min(8, 'Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule, un chiffre et un caractère spécial')
			.regex(
				passwordRegex,
				'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-gray-600">{t('auth.loading')}</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-blue-100 px-4">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center text-rose-700">
					{t('auth.login.title')}
				</h1>
				{error && (
					<div className="bg-rose-100 text-rose-700 px-3 py-2 rounded text-sm mb-4">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-4">
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="email">
							{t('auth.signup.email')}
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
							{...register('email')}
							disabled={loading}
						/>
						{errors.email && (
							<p className="text-rose-600 text-sm mt-1">{errors.email.message}</p>
						)}
					</div>
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="password">
							{t('auth.login.password')}
						</label>
						<input
							id="password"
							type="password"
							autoComplete="current-password"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
							{...register('password')}
							disabled={loading}
						/>
						{errors.password && (
							<p className="text-rose-600 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>
					<button
						type="submit"
						className="cursor-pointer w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
						disabled={loading}
					>
						{loading ? t('auth.login.signing') : t('auth.login.signIn')}
					</button>
				</form>
				
				{/* Google Auth */}
				<div className="mt-4">
					<button
						type="button"
						onClick={() => {
							window.location.assign('/api/auth/google')
						}}
						className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						{t('auth.login.googleSignIn')}
					</button>
				</div>

				<div className="mt-6 text-center text-sm text-gray-600">
					{t('auth.login.noAccount')}{' '}
					<Link href="/signup" className="text-rose-600 hover:underline">
						{t('auth.login.createAccount')}
					</Link>
				</div>
			</div>
		</div>
	)
}
