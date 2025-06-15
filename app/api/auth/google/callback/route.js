import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '../../../../../lib/mongodb'
import User from '../../../../../models/user'

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3030/api/auth/google/callback'
)

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url)
		const code = searchParams.get('code')
		const error = searchParams.get('error')
		const state = searchParams.get('state')

		console.log('Google callback received:', { 
			code: code ? 'present' : 'missing', 
			error, 
			state,
			redirectUri: process.env.GOOGLE_REDIRECT_URI 
		})

		if (error) {
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3030'}/login?error=google_auth_error`)
		}		if (!code) {
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3030'}/login?error=missing_code`)
		}		// Exchange code for tokens using direct HTTP approach to avoid PKCE issues
		let tokens
		try {
			console.log('🔄 Attempting token exchange with authorization code...')
			console.log('📋 Using redirect URI:', process.env.GOOGLE_REDIRECT_URI)
			
			// Use direct fetch to Google's token endpoint to have full control
			// This avoids any automatic PKCE parameter injection by the Google client library
			const tokenParams = new URLSearchParams({
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				code: code,
				grant_type: 'authorization_code',
				redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3030/api/auth/google/callback'
			})

			const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: tokenParams.toString()
			})

			const tokenData = await tokenResponse.json()
			
			if (!tokenResponse.ok) {
				console.error('❌ Token exchange failed:', tokenData)
				throw new Error(`Token exchange failed: ${tokenData.error_description || tokenData.error}`)
			}

			tokens = tokenData
			oauth2Client.setCredentials(tokens)
			
			console.log('✅ Token exchange successful via direct HTTP')
		} catch (tokenError) {
			console.error('❌ Token exchange error:', tokenError)
			console.error('🔍 Error details:', tokenError.message)
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3030'}/login?error=token_exchange_failed`)
		}

		// Get user info from Google
		const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
		const { data: userInfo } = await oauth2.userinfo.get()

		await connectMongo()

		// Check if user exists
		let user = await User.findOne({ email: userInfo.email })

		if (!user) {
			// Create new user
			user = new User({
				email: userInfo.email,
				username: userInfo.name || userInfo.email.split('@')[0],
				googleId: userInfo.id,
				avatar: userInfo.picture,
				isVerified: true
			})
			await user.save()
		} else {
			// Update existing user with Google info if not present
			if (!user.googleId) {
				user.googleId = userInfo.id
				user.avatar = userInfo.picture
				user.isVerified = true
				await user.save()
			}
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || 'fallback-secret',
			{ expiresIn: '7d' }
		)
		// Create response and set cookie
		const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3030'}/dashboard`)
		
		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: '/'
		})

		return response	} catch (error) {
		console.error('Google callback error:', error)
		return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3030'}/login?error=auth_failed`)
	}
}
