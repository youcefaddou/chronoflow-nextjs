import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simuler la récupération de l'historique des connexions
    // Dans un vrai projet, vous récupéreriez les données depuis votre base de données
    const loginHistory = [
      {
        _id: 'login_1',
        date: new Date('2024-12-15T08:30:00Z').toISOString(),
        ip: '192.168.1.100',
        browser: 'Chrome 121.0.0.0',
        location: 'Paris, France',
        success: true,
      },
      {
        _id: 'login_2',
        date: new Date('2024-12-14T18:45:00Z').toISOString(),
        ip: '192.168.1.100',
        browser: 'Chrome 121.0.0.0',
        location: 'Paris, France',
        success: true,
      },
      {
        _id: 'login_3',
        date: new Date('2024-12-14T09:15:00Z').toISOString(),
        ip: '192.168.1.101',
        browser: 'Safari 17.2',
        location: 'Lyon, France',
        success: true,
      },
      {
        _id: 'login_4',
        date: new Date('2024-12-13T22:30:00Z').toISOString(),
        ip: '203.0.113.42',
        browser: 'Chrome 120.0.0.0',
        location: 'Inconnu',
        success: false,
      },
      {
        _id: 'login_5',
        date: new Date('2024-12-13T14:20:00Z').toISOString(),
        ip: '192.168.1.100',
        browser: 'Chrome 121.0.0.0',
        location: 'Paris, France',
        success: true,
      }
    ]

    return NextResponse.json(loginHistory, { status: 200 })
  } catch (error) {
    console.error('Error fetching login history:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'historique des connexions' },
      { status: 500 }
    )
  }
}
