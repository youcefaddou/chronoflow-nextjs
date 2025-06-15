import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { subject, message, email } = body

    // Validation
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Le sujet et le message sont requis' },
        { status: 400 }
      )
    }

    if (subject.trim().length < 5) {
      return NextResponse.json(
        { error: 'Le sujet doit contenir au moins 5 caractères' },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le message doit contenir au moins 10 caractères' },
        { status: 400 }
      )
    }

    // Validation de l'email si fourni
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Simuler l'envoi du message de support
    // Dans un vrai projet, vous pourriez :
    // 1. Sauvegarder le message dans une base de données
    // 2. Envoyer un email à l'équipe de support
    // 3. Créer un ticket dans un système de ticketing
    // 4. Envoyer une notification
    
    console.log('Simulation: Nouveau message de support reçu')
    console.log('Sujet:', subject.trim())
    console.log('Message:', message.trim())
    console.log('Email:', email || 'Non fourni')
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Dans un vrai projet, vous pourriez faire quelque chose comme :
    /*
    // Sauvegarder dans la base de données
    const supportTicket = await db.supportTickets.create({
      subject: subject.trim(),
      message: message.trim(),
      email: email || null,
      userId: getUserIdFromSession(request), // si l'utilisateur est connecté
      status: 'open',
      createdAt: new Date(),
    })
    
    // Envoyer un email à l'équipe de support
    await sendEmailToSupport({
      subject: `[Support] ${subject.trim()}`,
      body: message.trim(),
      replyTo: email || null,
      ticketId: supportTicket.id,
    })
    
    // Envoyer un email de confirmation à l'utilisateur si email fourni
    if (email) {
      await sendConfirmationEmail(email, supportTicket.id)
    }
    */
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        ticketId: `TICKET_${Date.now()}` // ID fictif pour la démo
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending support message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
