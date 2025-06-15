'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/

const loginSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z
		.string()
		.min(8, 'Password must contain an uppercase, a lowercase, a number and a special character')
		.regex(
			passwordRegex,
			'Password must contain an uppercase, a lowercase, a number and a special character'
		),
})

export default function LoginPageEn() {
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	
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
			if (!res.ok) throw new Error(data.message || 'Login failed')
			router.push('/dashboard')
		} catch (err) {
			setLoading(false)
			setError(err.message)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-gray-600">Loading...</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-blue-100 px-4">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center text-rose-700">Sign in</h1>
				{error && (
					<div className="bg-rose-100 text-rose-700 px-3 py-2 rounded text-sm mb-4">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-4">
					<div>
						<label className="block mb-1 font-medium text-gray-700" htmlFor="email">
							Email
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
							Password
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
						{loading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>
				<div className="flex flex-col gap-2 mt-4">
					<button
						type="button"
						onClick={() => window.location.assign('/api/auth/google')}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
					>
						Sign in with Google
					</button>
				</div>
				<div className="mt-6 text-center text-sm text-gray-600">
					Don't have an account?{' '}
					<Link href="/en/signup" className="text-rose-600 hover:underline">
						Create an account
					</Link>
				</div>
			</div>
		</div>
	)
}
