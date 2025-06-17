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

export default function SignupPage() {
	const { t, ready } = useTranslation()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const router = useRouter()
	
	// Wait for i18n to be ready before rendering form
	const [i18nReady, setI18nReady] = useState(false)
	
	useEffect(() => {
		if (ready) {
			setI18nReady(true)
		}
	}, [ready])

	// Schema de validation avec i18n
	const signupSchema = z.object({
		email: z.string().email(t('auth.signup.emailInvalid') || 'Email invalide'),
		username: z.string().min(3, t('auth.signup.usernameRequired') || 'Nom d\'utilisateur requis'),
		password: z
			.string()
			.min(8, t('auth.signup.passwordMinLength') || 'Le mot de passe doit contenir au moins 8 caractères')
			.regex(
				passwordRegex,
				t('auth.signup.passwordFormat') || 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
			),
		confirmPassword: z.string().min(8, '8 caractères minimum'),
	}).refine(data => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword'],
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signupSchema),
		mode: 'onChange',
	})

	// Vérification de session au chargement
	useEffect(() => {
		const checkSession = async () => {
			try {
				const res = await fetch('/api/auth/session', { credentials: 'include' })
				if (res.ok) {
					router.push('/dashboard')
				}
			} catch (err) {
				// L'utilisateur n'est pas connecté, c'est normal
			}
		}
		checkSession()
	}, [router])

	const onSubmit = async ({ email, username, password }) => {
		setError('')
		setSuccess(false)
		setLoading(true)
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, username, password }),
				credentials: 'include',
			})
			const data = await res.json()
			setLoading(false)
			if (!res.ok) throw new Error(data.message || 'Signup failed')
			setSuccess(true)
			setTimeout(() => {
				router.push('/dashboard')
			}, 1200)
		} catch (err) {
			setLoading(false)
			setError(err.message)
		}
	}	
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 relative overflow-hidden">
			{/* Particules de fond animées */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-300/15 rounded-full blur-2xl animate-pulse delay-500"></div>
			</div>
			
			{!i18nReady ? (
				<div className="text-lg text-gray-600 relative z-10">Loading...</div>
			) : (
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-md relative z-10 hover:shadow-2xl transition-all duration-300">
				<h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
					{t('auth.signup.title')}
				</h1>
				{success && (
					<div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm mb-4 text-center">
						{t('auth.signup.success')}
					</div>
				)}				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
						<label className="block mb-1 font-medium text-gray-700" htmlFor="username">
							{t('auth.signup.username')}
						</label>						<input
							id="username"
							type="text"
							autoComplete="username"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white"
							{...register('username')}
							disabled={loading}
						/>
						{errors.username && (
							<p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
						)}
					</div>
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="password">
							{t('auth.signup.password')}
						</label>						<input
							id="password"
							type="password"
							autoComplete="new-password"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white"
							{...register('password')}
							disabled={loading}
						/>
						{errors.password && (
							<p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="confirmPassword">
							{t('auth.signup.confirmPassword')}
						</label>						<input
							id="confirmPassword"
							type="password"
							autoComplete="new-password"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white"
							{...register('confirmPassword')}
							disabled={loading}
						/>
						{errors.confirmPassword && (
							<p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
						)}
					</div>					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60 transform hover:scale-[1.02] hover:shadow-lg"
						disabled={loading}
					>
						{loading ? t('auth.signup.creating') : t('auth.signup.create')}
					</button>
				</form>
				
				{/* Google Auth */}
				<div className="mt-4">
					<button
						type="button"
						onClick={() => window.location.assign('/api/auth/google')}
						className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
						disabled={loading}
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
					{t('auth.signup.hasAccount')}{' '}
					<Link href="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-300">
						{t('auth.signup.signIn')}
					</Link>
				</div>
			</div>
			)}
		</div>
	)
}
