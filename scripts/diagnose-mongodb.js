#!/usr/bin/env node
/**
 * Script de diagnostic pour vérifier la configuration MongoDB
 */

import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

console.log('Diagnostic de la configuration MongoDB:')
console.log('=====================================')

console.log('NODE_ENV:', process.env.NODE_ENV || 'non défini')
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'défini (***masqué***)' : 'NON DÉFINI')

if (!process.env.MONGODB_URI) {
  console.log('\n❌ MONGODB_URI n\'est pas défini!')
  console.log('💡 Solutions:')
  console.log('   1. Créer un fichier .env.local avec MONGODB_URI=votre_uri_mongodb')
  console.log('   2. Ou définir MONGODB_URI dans vos variables d\'environnement système')
  console.log('   3. Vérifier que le fichier .env.local est à la racine du projet')
} else {
  console.log('✅ MONGODB_URI est défini')
  
  // Test basique de connexion
  try {
    const { default: mongoose } = await import('mongoose')
    
    console.log('\n🔗 Test de connexion MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connexion MongoDB réussie!')
    
    await mongoose.connection.close()
    console.log('✅ Connexion fermée proprement')
    
  } catch (error) {
    console.log('❌ Erreur de connexion MongoDB:', error.message)
  }
}

console.log('\nFichiers .env présents:')
import { existsSync } from 'fs'
console.log('.env.local:', existsSync('.env.local') ? '✅ existe' : '❌ n\'existe pas')
console.log('.env:', existsSync('.env') ? '✅ existe' : '❌ n\'existe pas')
console.log('.env.example:', existsSync('.env.example') ? '✅ existe' : '❌ n\'existe pas')
