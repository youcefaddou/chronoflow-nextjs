import Link from 'next/link'

export default function ConditionsUtilisationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions générales d'utilisation</h1>
            <p className="text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Présentation du service</h2>
              <p className="mb-4">
                ChronoFlow est une application de gestion du temps et de productivité qui permet aux utilisateurs 
                de suivre leurs tâches, projets et temps de travail. Le service est édité par ADDOU Youcef, 
                auto-entrepreneur basé à Marseille, France.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><strong>URL du service :</strong> <a href="https://chronoflow.xyz" className="text-blue-600 hover:underline">https://chronoflow.xyz</a></p>
                <p><strong>Contact :</strong> <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline">contact.chronoflow@gmail.com</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Acceptation des conditions</h2>
              <p className="mb-4">
                L'utilisation de ChronoFlow implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
              </p>
              <p className="mb-4">
                L'utilisation du service est réservée aux personnes âgées de 16 ans minimum. 
                Les mineurs doivent obtenir l'autorisation de leurs représentants légaux.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Inscription et compte utilisateur</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">3.1 Création de compte</h3>
              <p className="mb-4">
                Pour utiliser ChronoFlow, vous devez créer un compte en fournissant des informations exactes et complètes. 
                Vous pouvez vous inscrire via :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Email et mot de passe</li>
                <li>Authentification Google</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">3.2 Responsabilité du compte</h3>
              <p className="mb-4">
                Vous êtes responsable de :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>La confidentialité de vos identifiants</li>
                <li>Toutes les activités effectuées avec votre compte</li>
                <li>La mise à jour de vos informations personnelles</li>
                <li>Nous signaler immédiatement tout usage non autorisé</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Description du service</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">4.1 Fonctionnalités gratuites</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Création et gestion jusqu'à 5 tâches</li>
                <li>Timer basique</li>
                <li>Fonctionnalités de base</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">4.2 Fonctionnalités premium (ChronoFlow Pro)</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Tâches et projets illimités</li>
                <li>Intégration Google Calendar</li>
                <li>Rapports et statistiques avancés</li>
                <li>Mode focus avancé</li>
                <li>Support prioritaire</li>
                <li>Export des données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Conditions d'abonnement</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">5.1 Tarifs</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>ChronoFlow Pro :</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Abonnement mensuel : 9,99€ TTC/mois</li>
                  <li>Abonnement annuel : 99,00€ TTC/an (économie de 2 mois)</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-3">5.2 Facturation</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Les abonnements sont facturés à l'avance</li>
                <li>Le renouvellement est automatique sauf résiliation</li>
                <li>Les tarifs peuvent être modifiés avec un préavis de 30 jours</li>
                <li>TVA française applicable selon la réglementation</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">5.3 Paiement</h3>
              <p className="mb-4">
                Les paiements sont traités de manière sécurisée par Stripe. 
                Nous acceptons les principales cartes bancaires (Visa, Mastercard, American Express).
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-3">5.4 Résiliation</h3>
              <p className="mb-4">
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace utilisateur. 
                La résiliation prend effet à la fin de la période de facturation en cours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Droit de rétractation et remboursement</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-yellow-800 mb-2">🔄 Droit de rétractation (14 jours)</h3>
                <p className="text-yellow-700">
                  Conformément au Code de la consommation, vous disposez d'un délai de 14 jours pour vous rétracter 
                  à compter de la souscription de votre abonnement.
                </p>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-3">6.1 Conditions de remboursement</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Remboursement intégral si demande dans les 14 jours</li>
                <li>Aucun remboursement partiel après utilisation des services</li>
                <li>Remboursement traité sous 14 jours ouvrés</li>
                <li>Remboursement sur le moyen de paiement utilisé</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">6.2 Procédure de remboursement</h3>
              <p className="mb-4">
                Pour demander un remboursement, contactez-nous à : 
                <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline ml-1">
                   contact.chronoflow@gmail.com
                </a> {''}
                 avec l'objet "Demande de remboursement".
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Utilisation du service</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">7.1 Usage autorisé</h3>
              <p className="mb-4">ChronoFlow est destiné à un usage personnel et professionnel licite. Vous vous engagez à :</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Utiliser le service conformément à sa destination</li>
                <li>Respecter les droits des tiers</li>
                <li>Ne pas porter atteinte à l'intégrité du système</li>
                <li>Respecter les lois et réglementations applicables</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">7.2 Usages interdits</h3>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="font-medium text-red-800 mb-2">Il est strictement interdit de :</p>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Utiliser le service à des fins illégales</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Partager vos identifiants avec des tiers</li>
                  <li>Utiliser des robots, scripts ou outils automatisés</li>
                  <li>Surcharger les serveurs ou perturber le service</li>
                  <li>Extraire ou copier le contenu du service</li>
                  <li>Créer plusieurs comptes pour contourner les limitations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
              <p className="mb-4">
                ChronoFlow, son code source, sa conception, ses textes, images et tous les éléments qui le composent 
                sont protégés par les droits de propriété intellectuelle.
              </p>
              <p className="mb-4">
                Vous disposez d'un droit d'usage personnel et non exclusif sur le service. 
                Aucune licence ou cession de droits n'est consentie au-delà de l'utilisation du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Données et sauvegarde</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">9.1 Vos données</h3>
              <p className="mb-4">
                Vous conservez la propriété de toutes les données que vous saisissez dans ChronoFlow 
                (tâches, projets, temps, etc.). Nous nous engageons à ne pas les exploiter à des fins commerciales.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-3">9.2 Sauvegarde</h3>
              <p className="mb-4">
                Nous effectuons des sauvegardes régulières, mais nous vous recommandons d'exporter 
                régulièrement vos données importantes.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-3">9.3 Suppression de compte</h3>
              <p className="mb-4">
                En cas de suppression de votre compte, vos données seront définitivement effacées 
                dans un délai de 30 jours, sauf obligations légales de conservation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Disponibilité du service</h2>
              <p className="mb-4">
                Nous nous efforçons d'assurer une disponibilité maximale du service, mais ne pouvons garantir 
                un fonctionnement ininterrompu. Le service peut être temporairement indisponible pour :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Maintenance programmée ou d'urgence</li>
                <li>Défaillances techniques</li>
                <li>Cas de force majeure</li>
              </ul>
              <p className="mb-4">
                Nous nous efforçons de minimiser ces interruptions et d'informer les utilisateurs à l'avance 
                lorsque cela est possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Limitation de responsabilité</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-4">
                  Le service est fourni "en l'état". Nous ne pouvons être tenus responsables :
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Des dommages directs ou indirects résultant de l'utilisation</li>
                  <li>De la perte de données due à une défaillance technique</li>
                  <li>Des préjudices liés à une indisponibilité temporaire</li>
                  <li>De l'usage fait par les tiers de vos données</li>
                </ul>
                <p className="font-medium">
                  Notre responsabilité est limitée au montant des sommes versées au cours des 12 derniers mois.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Suspension et résiliation</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">12.1 Suspension</h3>
              <p className="mb-4">
                Nous nous réservons le droit de suspendre votre accès en cas de :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Violation des présentes conditions</li>
                <li>Usage abusif du service</li>
                <li>Défaut de paiement</li>
                <li>Demande d'autorité judiciaire</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">12.2 Résiliation</h3>
              <p className="mb-4">
                Chaque partie peut résilier le contrat à tout moment. 
                En cas de résiliation pour faute, aucun remboursement ne sera effectué.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Modifications des conditions</h2>
              <p className="mb-4">
                Ces conditions peuvent être modifiées à tout moment. 
                Les utilisateurs seront informés des modifications importantes par email ou via l'application.
              </p>
              <p className="mb-4">
                La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Droit applicable et juridiction</h2>
              <p className="mb-4">
                Les présentes conditions sont soumises au droit français. 
                En cas de litige, nous privilégions la résolution amiable.
              </p>
              <p className="mb-4">
                À défaut d'accord amiable, les tribunaux français seront seuls compétents, 
                nonobstant pluralité de défendeurs ou appel en garantie.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Contact et réclamations</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="mb-2">Pour toute question ou réclamation :</p>
                <p><strong>Email :</strong> <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline">contact.chronoflow@gmail.com</a></p>
                <p><strong>Délai de réponse :</strong> Nous nous engageons à répondre sous 48h ouvrées</p>
                
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="font-medium">Médiation de la consommation :</p>
                  <p className="text-sm">
                    En cas de litige non résolu, vous pouvez saisir gratuitement le médiateur de la consommation 
                    dont nous relevons ou tout médiateur inscrit sur la liste de la Commission d'évaluation 
                    et de contrôle de la médiation de la consommation.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
