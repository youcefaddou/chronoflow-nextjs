import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true },
	password: { type: String }, // Optional for Google users
	googleId: { type: String }, // Google user ID
	avatar: { type: String }, // Profile picture URL
	isVerified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	lastSignInAt: { type: Date },
	provider: { type: String }, // for OAuth
	providerId: { type: String }, // for OAuth
	googleCalendarTokens: {
		access_token: { type: String },
		refresh_token: { type: String },
		scope: { type: String },
		token_type: { type: String },
		expiry_date: { type: Number },
	},
})

export default mongoose.models.User || mongoose.model('User', userSchema)
