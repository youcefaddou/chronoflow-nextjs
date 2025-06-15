import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { oldPassword, newPassword } = body

    // Validation
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Ancien et nouveau mot de passe sont requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Simuler la vérification de l'ancien mot de passe
    // Dans un vrai projet, vous vérifieriez le mot de passe avec bcrypt ou similar
    if (oldPassword !== 'password123') { // Simulation
      return NextResponse.json(
        { error: 'Ancien mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Simuler la mise à jour du mot de passe
    // Dans un vrai projet, vous hasheriez le nouveau mot de passe et le sauvegarderiez
    console.log('Simulation: Changement de mot de passe pour l\'utilisateur')
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Mot de passe modifié avec succès' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    )
  }
}
