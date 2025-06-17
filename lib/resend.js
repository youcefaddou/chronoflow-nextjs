import { Resend } from 'resend';

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse email par défaut (doit être vérifiée dans Resend)
const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@chronoflow.app';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'contact.chronoflow@gmail.com';

/**
 * Envoie un email de contact vers l'équipe support
 * @param {Object} params - Paramètres de l'email
 * @param {string} params.subject - Sujet du message
 * @param {string} params.message - Contenu du message
 * @param {string} params.email - Email de l'expéditeur
 * @param {string} params.language - Langue ('fr' ou 'en')
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export async function sendContactEmail({ subject, message, email, language = 'fr' }) {
  try {
    // Email à l'équipe support
    const supportEmailResult = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [SUPPORT_EMAIL],
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
    });

    // Email de confirmation à l'utilisateur (si email fourni)
    let confirmationResult = null;
    if (email) {
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
      };

      confirmationResult = await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
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
      });
    }

    return {
      success: true,
      supportEmailId: supportEmailResult.data?.id,
      confirmationEmailId: confirmationResult?.data?.id,
    };
  } catch (error) {
    console.error('Erreur envoi email Resend:', error);
    throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
  }
}

/**
 * Vérifie la configuration Resend
 * @returns {boolean} True si la configuration est valide
 */
export function checkResendConfig() {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export default resend;
