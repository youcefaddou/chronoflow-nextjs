import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simuler l'export des données utilisateur
    // Dans un vrai projet, vous récupéreriez les données depuis votre base de données
    const userData = {
      user: {
        id: 'user_123',
        username: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date().toISOString(),
        lastSignInAt: new Date().toISOString(),
      },
      tasks: [
        {
          id: 'task_1',
          title: 'Exemple de tâche',
          description: 'Description de la tâche',
          completed: false,
          createdAt: new Date().toISOString(),
          timeSpent: 3600, // en secondes
        }
      ],
      timerSessions: [
        {
          id: 'session_1',
          taskId: 'task_1',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: 3600,
        }
      ],
      projects: [
        {
          id: 'project_1',
          name: 'Projet exemple',
          description: 'Description du projet',
          createdAt: new Date().toISOString(),
        }
      ],
      settings: {
        language: 'fr',
        theme: 'light',
        notifications: true,
      },
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }

    // Créer un blob JSON
    const jsonData = JSON.stringify(userData, null, 2)
    
    // Retourner le fichier JSON
    return new Response(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="chronoflow-data-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des données' },
      { status: 500 }
    )
  }
}
