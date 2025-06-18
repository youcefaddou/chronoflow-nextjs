import Link from 'next/link'

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
            <p className="text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                ChronoFlow respecte votre vie privée et s'engage à protéger vos données personnelles. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Responsable du traitement</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><strong>Responsable :</strong> ADDOU Youcef</p>
                <p><strong>Email :</strong> contact.chronoflow@gmail.com</p>
                <p><strong>Adresse :</strong> Marseille, France</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Données collectées</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">3.1 Données d'inscription</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Mot de passe (chiffré)</li>
                <li>Date de création du compte</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">3.2 Données d'utilisation</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Tâches et projets créés</li>
                <li>Temps de travail enregistré</li>
                <li>Préférences de l'application</li>
                <li>Données de calendrier (avec votre consentement)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">3.3 Données techniques</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Données de connexion</li>
                <li>Logs d'utilisation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Finalités du traitement</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">🔐 Gestion des comptes utilisateurs</h3>
                  <p>Création, authentification et gestion de votre compte</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Base légale :</strong> Exécution du contrat</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">⚡ Fonctionnement du service</h3>
                  <p>Sauvegarde de vos tâches, projets et données de temps</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Base légale :</strong> Exécution du contrat</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">💳 Gestion des abonnements</h3>
                  <p>Traitement des paiements et facturation</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Base légale :</strong> Exécution du contrat</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">🔗 Intégrations tierces</h3>
                  <p>Synchronisation avec Google Calendar (avec votre consentement)</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Base légale :</strong> Consentement</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">📊 Amélioration du service</h3>
                  <p>Analyse d'usage pour améliorer l'expérience utilisateur</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Base légale :</strong> Intérêt légitime</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Partage des données</h2>
              <p className="mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Prestataires techniques :</strong> Hébergement (Vercel), base de données (MongoDB Atlas)</li>
                <li><strong>Paiements :</strong> Stripe pour le traitement des abonnements</li>
                <li><strong>Intégrations :</strong> Google pour la synchronisation calendrier (avec votre consentement)</li>
                <li><strong>Obligations légales :</strong> Si requis par la loi ou une autorité compétente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Transferts internationaux</h2>
              <p className="mb-4">
                Certains de nos prestataires sont situés hors de l'Union européenne (notamment aux États-Unis). 
                Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types, certifications adequacy decisions).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Durée de conservation</h2>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Données de compte :</strong> Jusqu'à suppression du compte + 1 an pour les obligations légales</li>
                <li><strong>Données d'utilisation :</strong> Jusqu'à suppression du compte</li>
                <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                <li><strong>Logs techniques :</strong> 12 mois maximum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Vos droits</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="font-medium mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Droit d'accès :</strong> Connaître les données que nous détenons sur vous</li>
                  <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> Supprimer vos données dans certains cas</li>
                  <li><strong>Droit de portabilité :</strong> Récupérer vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> Vous opposer au traitement pour motif légitime</li>
                  <li><strong>Droit de limitation :</strong> Limiter le traitement dans certains cas</li>
                  <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
                </ul>
                <p className="mt-4 font-medium">
                  Pour exercer ces droits, contactez-nous à : 
                  <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline ml-1">
                    contact.chronoflow@gmail.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Sécurité des données</h2>
              <p className="mb-4">
                Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Chiffrement des données en transit (HTTPS)</li>
                <li>Chiffrement des mots de passe</li>
                <li>Accès sécurisé aux bases de données</li>
                <li>Sauvegardes régulières</li>
                <li>Surveillance des accès</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Cookies</h2>
              <p className="mb-4">
                L'utilisation des cookies est détaillée dans notre{' '}
                <Link href="/legal/politique-cookies" className="text-blue-600 hover:underline">
                  Politique de cookies
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Réclamations</h2>
              <p className="mb-4">
                Si vous estimez que nous ne respectons pas la réglementation sur la protection des données, 
                vous pouvez déposer une réclamation auprès de la CNIL :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>CNIL</strong></p>
                <p>3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
                <p>Tél : 01 53 73 22 22</p>
                <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Modifications</h2>
              <p className="mb-4">
                Cette politique de confidentialité peut être modifiée à tout moment. 
                Nous vous informerons de toute modification importante par email ou via l'application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="mb-2">Pour toute question concernant cette politique de confidentialité :</p>
                <p><strong>Email :</strong> <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline">contact.chronoflow@gmail.com</a></p>
                <p><strong>Objet :</strong> "Protection des données personnelles"</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
