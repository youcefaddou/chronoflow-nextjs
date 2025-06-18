import Link from 'next/link'

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentions légales</h1>
            <p className="text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Informations sur l'éditeur</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Dénomination :</strong> ADDOU Youcef - Auto-entrepreneur</p>
                <p><strong>Adresse :</strong> Avenue de la Timone - Marseille, France</p>
                <p><strong>Email :</strong> contact.chronoflow@gmail.com</p>
                <p><strong>SIRET :</strong> En cours d'attribution</p>
                <p><strong>Activité :</strong> Développement et édition de logiciels applicatifs</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
              <p className="mb-4">
                Le site ChronoFlow et l'ensemble de son contenu (textes, images, logos, icônes, etc.) sont protégés par le droit d'auteur. 
                Toute reproduction, distribution, modification ou utilisation du contenu sans autorisation écrite préalable est strictement interdite.
              </p>
              <p className="mb-4">
                Les marques, logos et noms de domaine appartiennent à leurs propriétaires respectifs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Limitation de responsabilité</h2>
              <p className="mb-4">
                L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. 
                Cependant, il ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
              </p>
              <p className="mb-4">
                L'éditeur ne saurait être tenu responsable des dommages directs ou indirects qui pourraient résulter de l'utilisation du site ou de l'impossibilité d'y accéder.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Données personnelles</h2>
              <p className="mb-4">
                Le traitement des données personnelles est régi par notre{' '}
                <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
                  Politique de confidentialité
                </Link>
                , conforme au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
              <p className="mb-4">
                L'utilisation des cookies est détaillée dans notre{' '}
                <Link href="/legal/politique-cookies" className="text-blue-600 hover:underline">
                  Politique de cookies
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Droit applicable</h2>
              <p className="mb-4">
                Les présentes mentions légales sont soumises au droit français. 
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à l'adresse : 
                <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline ml-1">
                  contact.chronoflow@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
