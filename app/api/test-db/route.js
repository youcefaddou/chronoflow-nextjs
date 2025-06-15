import { connectMongo } from '../../../lib/mongodb.js'

export async function GET() {
	try {
		await connectMongo()
		
		return Response.json({
			status: 'success',
			message: 'MongoDB connexion réussie!'
		}, { status: 200 })
	} catch (error) {
		return Response.json({
			status: 'error',
			message: 'Erreur de connexion MongoDB',
			error: error.message
		}, { status: 500 })
	}
}
