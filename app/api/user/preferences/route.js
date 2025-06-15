import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { language } = body

    // Validation
    if (!language || !['fr', 'en'].includes(language)) {
      return NextResponse.json(
        { error: 'Langue non supportée' },
        { status: 400 }
      )
    }

    // Simuler la sauvegarde des préférences
    // Dans un vrai projet, vous sauvegarderiez les préférences dans votre base de données
    console.log('Simulation: Sauvegarde de la langue:', language)
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json(
      { 
        success: true, 
        language,
        message: 'Préférences sauvegardées avec succès' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des préférences' },
      { status: 500 }
    )
  }
}
