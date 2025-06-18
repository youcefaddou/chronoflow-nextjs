import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { subject, message, email, language = 'fr' } = body

    // Validation
    if (!subject || !message) {
      return NextResponse.json(
        { error: language === 'fr' ? 'Le sujet et le message sont requis' : 'Subject and message are required' },
        { status: 400 }
      )
    }

    if (subject.trim().length < 5) {
      return NextResponse.json(
        { error: language === 'fr' ? 'Le sujet doit contenir au moins 5 caractères' : 'Subject must be at least 5 characters long' },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: language === 'fr' ? 'Le message doit contenir au moins 10 caractères' : 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Validation de l'email si fourni
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: language === 'fr' ? 'Format d\'email invalide' : 'Invalid email format' },
        { status: 400 }
      )
    }

    // Vérifier la configuration Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY manquante, passage en mode simulation')
      
      return NextResponse.json({
        success: true,
        message: language === 'fr' 
          ? 'Message envoyé avec succès (mode démo). Configurez Resend pour l\'envoi réel.'
          : 'Message sent successfully (demo mode). Configure Resend for real sending.',
        mode: 'simulation'
      })
    }

    // Configuration des emails
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev'
    const supportEmail = process.env.SUPPORT_EMAIL || 'contact.chronoflow@gmail.com'

    // Email à l'équipe support
    const { data: supportData, error: supportError } = await resend.emails.send({
      from: fromEmail,
      to: [supportEmail],
      subject: `[Contact ChronoFlow] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Nouveau message de contact - ChronoFlow</h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>De :</strong> ${email || 'Email non fourni'}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
            <p><strong>Langue :</strong> ${language === 'fr' ? 'Français' : 'English'}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message :</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Réponse recommandée :</strong> ${email ? `Répondre directement à ${email}` : 'Pas d\'email fourni pour la réponse'}
            </p>
          </div>
        </div>
      `,
      replyTo: email ? [email] : undefined,
    })

    if (supportError) {
      console.error('Erreur envoi email support:', supportError)
      return NextResponse.json(
        { error: language === 'fr' ? 'Erreur lors de l\'envoi du message' : 'Error sending message' },
        { status: 500 }
      )
    }    // Email de confirmation à l'utilisateur (si email fourni)
    // Note: Avec le plan gratuit Resend, on ne peut envoyer qu'à l'email du propriétaire du compte
    let confirmationData = null
    const ownerEmail = 'contact.chronoflow@gmail.com' // Remplace par ton email Resend
    if (email && email.toLowerCase() === ownerEmail.toLowerCase()) {
      const confirmationContent = language === 'fr' ? {
        subject: 'Confirmation - Votre message a été reçu',
        title: 'Merci pour votre message !',
        greeting: 'Bonjour,',
        message1: 'Nous avons bien reçu votre message concernant :',
        message2: 'Notre équipe va examiner votre demande et vous répondra dans les plus brefs délais, généralement sous 24 heures.',
        message3: 'En attendant, n\'hésitez pas à consulter notre',
        faqLink: 'FAQ',
        message4: 'qui contient peut-être déjà la réponse à votre question.',
        signature: 'L\'équipe ChronoFlow',
        footer: 'Cet email est envoyé automatiquement, merci de ne pas y répondre directement.'
      } : {
        subject: 'Confirmation - Your message has been received',
        title: 'Thank you for your message!',
        greeting: 'Hello,',
        message1: 'We have received your message regarding:',
        message2: 'Our team will review your request and respond as soon as possible, usually within 24 hours.',
        message3: 'In the meantime, feel free to check our',
        faqLink: 'FAQ',
        message4: 'which may already contain the answer to your question.',
        signature: 'The ChronoFlow Team',
        footer: 'This email is sent automatically, please do not reply directly.'
      }

      const { data: confData, error: confError } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: confirmationContent.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px 0;">
              <h1 style="color: #2563eb; margin: 0;">ChronoFlow</h1>
            </div>
            
            <h2 style="color: #1f2937;">${confirmationContent.title}</h2>
            
            <p>${confirmationContent.greeting}</p>
            
            <p>${confirmationContent.message1}</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 0; font-weight: bold;">${subject}</p>
            </div>
            
            <p>${confirmationContent.message2}</p>
            
            <p>
              ${confirmationContent.message3} 
              <a href="https://chronoflow.app/faq" style="color: #2563eb; text-decoration: none;">
                ${confirmationContent.faqLink}
              </a> 
              ${confirmationContent.message4}
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0;">${confirmationContent.signature}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                ${confirmationContent.footer}
              </p>
            </div>
          </div>
        `,
      })

      if (confError) {
        console.warn('Erreur envoi email confirmation:', confError)
      } else {
        confirmationData = confData
      }
    }

    return NextResponse.json({
      success: true,
      message: language === 'fr'
        ? 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
        : 'Your message has been sent successfully. We will respond as soon as possible.',
      emailIds: {
        support: supportData?.id,
        confirmation: confirmationData?.id
      }
    })

  } catch (error) {
    console.error('Error sending support message:', error)
    return NextResponse.json(
      { 
        error: body?.language === 'fr' 
          ? 'Erreur lors de l\'envoi du message. Veuillez réessayer.' 
          : 'Error sending message. Please try again.'
      },
      { status: 500 }
    )
  }
}
