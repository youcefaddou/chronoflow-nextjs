/**
 * Script de diagnostic pour vérifier la configuration MongoDB
 */

import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

  // Test basique de connexion
  try {
    const { default: mongoose } = await import('mongoose')
    await mongoose.connect(process.env.MONGODB_URI)
    await mongoose.connection.close()  
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message)
    console.error('Vérifiez votre URI MongoDB dans .env.local ou .env')
    process.exit(1)
  }


