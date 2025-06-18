import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
	try {
	
		
		const scopes = [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
		
		// Generate a state parameter for security
		const state = crypto.randomBytes(32).toString('hex')
		
		// Generate OAuth URL manually to avoid any PKCE parameter injection
		const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
		const params = new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID,
			redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3030/api/auth/google/callback',
			response_type: 'code',
			scope: scopes.join(' '),
			access_type: 'online',
			state: state,
			include_granted_scopes: 'false'
		})
		
		const authUrl = `${baseUrl}?${params.toString()}`
		
		return NextResponse.redirect(authUrl)
	} catch (error) {
		console.error('❌ Google auth error:', error)
		return NextResponse.json(
			{ error: 'OAuth initialization failed' }, 
			{ status: 500 }
		)
	}
}
