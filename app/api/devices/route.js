import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simuler la récupération des appareils connectés
    // Dans un vrai projet, vous récupéreriez les données depuis votre base de données
    const devices = [
      {
        _id: 'device_1',
        device: 'Chrome sur Windows',
        ip: '192.168.1.100',
        browser: 'Chrome 121.0.0.0',
        createdAt: new Date('2024-12-10T10:30:00Z').toISOString(),
      },
      {
        _id: 'device_2',
        device: 'Safari sur MacOS',
        ip: '192.168.1.101',
        browser: 'Safari 17.2',
        createdAt: new Date('2024-12-08T14:15:00Z').toISOString(),
      },
      {
        _id: 'device_3',
        device: 'Firefox sur Linux',
        ip: '192.168.1.102',
        browser: 'Firefox 121.0',
        createdAt: new Date('2024-12-05T09:45:00Z').toISOString(),
      }
    ]

    return NextResponse.json(devices, { status: 200 })
  } catch (error) {
    console.error('Error fetching connected devices:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des appareils connectés' },
      { status: 500 }
    )
  }
}
