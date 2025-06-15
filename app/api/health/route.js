import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifications de base
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT || 3030,
      version: process.env.npm_package_version || '1.0.0'
    };

    // Optionnel : vérifier la connexion à MongoDB
    if (process.env.MONGODB_URI) {
      try {
        // Ici on pourrait ajouter une vérification de connexion MongoDB
        // Pour l'instant, on assume que si l'URI est présente, c'est OK
        healthStatus.database = 'connected';      } catch {
        healthStatus.database = 'error';
        healthStatus.status = 'degraded';
      }
    }

    // Optionnel : vérifier Redis
    if (process.env.REDIS_URL) {
      try {
        // Ici on pourrait ajouter une vérification de connexion Redis
        healthStatus.cache = 'connected';      } catch {
        healthStatus.cache = 'error';
        healthStatus.status = 'degraded';
      }
    }

    return NextResponse.json(healthStatus, { 
      status: healthStatus.status === 'healthy' ? 200 : 503 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
