import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simuler la récupération des données du profil utilisateur
    // Dans un vrai projet, vous récupéreriez les données depuis votre base de données
    const userProfile = {
      id: 'user_123',
      username: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date('2024-01-15').toISOString(),
      lastSignInAt: new Date().toISOString(),
    }

    return NextResponse.json(userProfile, { status: 200 })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement du profil' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { username } = body

    // Validation
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom d\'utilisateur est requis' },
        { status: 400 }
      )
    }

    if (username.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom d\'utilisateur doit contenir au moins 2 caractères' },
        { status: 400 }
      )
    }

    // Simuler la mise à jour du profil
    // Dans un vrai projet, vous mettriez à jour les données dans votre base de données
    console.log('Simulation: Mise à jour du nom d\'utilisateur:', username.trim())
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedProfile = {
      id: 'user_123',
      username: username.trim(),
      email: 'john.doe@example.com',
      createdAt: new Date('2024-01-15').toISOString(),
      lastSignInAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}
