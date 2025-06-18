import Link from 'next/link'

export default function PolitiqueCookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de cookies</h1>
            <p className="text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p className="mb-4">
                Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) 
                lors de votre visite sur ChronoFlow. Les cookies permettent de mémoriser des informations 
                sur votre navigation et d'améliorer votre expérience utilisateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Types de cookies utilisés</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">🔧 Cookies strictement nécessaires</h3>
                  <p className="text-green-700 mb-3">
                    Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Cookie de session (next-auth.session-token)</strong></p>
                      <p className="text-sm text-gray-600">Maintient votre connexion pendant votre session</p>
                      <p className="text-sm text-gray-500">Durée : Session navigateur</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Cookie CSRF (next-auth.csrf-token)</strong></p>
                      <p className="text-sm text-gray-600">Protection contre les attaques CSRF</p>
                      <p className="text-sm text-gray-500">Durée : Session navigateur</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Préférences utilisateur</strong></p>
                      <p className="text-sm text-gray-600">Thème sombre/clair, langue, paramètres d'affichage</p>
                      <p className="text-sm text-gray-500">Durée : 1 an</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-3">📊 Cookies de fonctionnalités</h3>
                  <p className="text-blue-700 mb-3">
                    Ces cookies améliorent votre expérience en retenant vos préférences.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border">
                      <p><strong>État du timer</strong></p>
                      <p className="text-sm text-gray-600">Sauvegarde l'état de votre timer en cours</p>
                      <p className="text-sm text-gray-500">Durée : 24 heures</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Filtres et vues</strong></p>
                      <p className="text-sm text-gray-600">Mémorise vos filtres et préférences d'affichage</p>
                      <p className="text-sm text-gray-500">Durée : 30 jours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-orange-800 mb-3">📈 Cookies analytiques (optionnels)</h3>
                  <p className="text-orange-700 mb-3">
                    Ces cookies nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Statistiques d'usage</strong></p>
                      <p className="text-sm text-gray-600">Pages visitées, temps passé, actions effectuées</p>
                      <p className="text-sm text-gray-500">Durée : 2 ans</p>
                      <p className="text-sm text-green-600 font-medium">✓ Données anonymisées</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cookies tiers</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">🔐 Google OAuth</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Lorsque vous vous connectez avec Google, des cookies Google peuvent être déposés 
                    pour maintenir votre authentification.
                  </p>
                  <p className="text-sm text-gray-500">
                    Consultez la politique de Google : 
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">💳 Stripe (paiements)</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Lors des paiements, Stripe peut déposer des cookies pour sécuriser les transactions.
                  </p>
                  <p className="text-sm text-gray-500">
                    Consultez la politique de Stripe : 
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      stripe.com/privacy
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">📅 Google Calendar</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Si vous connectez votre Google Calendar, des cookies Google peuvent être utilisés 
                    pour maintenir la synchronisation.
                  </p>
                  <p className="text-sm text-gray-500">
                    Consultez la politique de Google : 
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Gestion de vos préférences</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="font-medium text-blue-900 mb-3">🎛️ Panneau de préférences</h3>
                <p className="text-blue-800 mb-3">
                  Vous pouvez gérer vos préférences de cookies directement dans l'application 
                  via le panneau de paramètres.
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Gérer mes préférences
                </button>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-3">4.1 Paramètres du navigateur</h3>
              <p className="mb-4">
                Vous pouvez également configurer votre navigateur pour :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Accepter ou refuser tous les cookies</li>
                <li>Être informé avant l'enregistrement d'un cookie</li>
                <li>Supprimer les cookies existants</li>
              </ul>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Chrome</h4>
                  <p className="text-sm text-gray-600">
                    Paramètres → Confidentialité et sécurité → Cookies et autres données de site
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Firefox</h4>
                  <p className="text-sm text-gray-600">
                    Paramètres → Vie privée et sécurité → Cookies et données de sites
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Safari</h4>
                  <p className="text-sm text-gray-600">
                    Préférences → Confidentialité → Cookies et données de sites web
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Edge</h4>
                  <p className="text-sm text-gray-600">
                    Paramètres → Cookies et autorisations de site → Cookies et données stockées
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important</h4>
                <p className="text-yellow-700">
                  La désactivation des cookies nécessaires peut affecter le fonctionnement de ChronoFlow. 
                  Certaines fonctionnalités peuvent ne plus être disponibles.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Durée de conservation</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Type de cookie</th>
                      <th className="border border-gray-300 p-3 text-left">Durée</th>
                      <th className="border border-gray-300 p-3 text-left">Suppression</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Session</td>
                      <td className="border border-gray-300 p-3">Fermeture du navigateur</td>
                      <td className="border border-gray-300 p-3">Automatique</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Préférences</td>
                      <td className="border border-gray-300 p-3">1 an</td>
                      <td className="border border-gray-300 p-3">Automatique</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Fonctionnalités</td>
                      <td className="border border-gray-300 p-3">30 jours</td>
                      <td className="border border-gray-300 p-3">Automatique</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Analytiques</td>
                      <td className="border border-gray-300 p-3">2 ans</td>
                      <td className="border border-gray-300 p-3">Configurable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Vos droits</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-medium text-green-800 mb-3">Vous avez le droit de :</p>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Être informé de l'utilisation des cookies</li>
                  <li>Accepter ou refuser les cookies non nécessaires</li>
                  <li>Modifier vos préférences à tout moment</li>
                  <li>Supprimer les cookies de votre navigateur</li>
                  <li>Demander des informations sur les cookies utilisés</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Modifications de cette politique</h2>
              <p className="mb-4">
                Cette politique de cookies peut être modifiée à tout moment pour refléter les évolutions 
                de nos pratiques ou de la réglementation.
              </p>
              <p className="mb-4">
                Les modifications importantes vous seront notifiées par email ou via une bannière sur le site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="mb-2">Pour toute question concernant notre politique de cookies :</p>
                <p><strong>Email :</strong> <a href="mailto:contact.chronoflow@gmail.com" className="text-blue-600 hover:underline">contact.chronoflow@gmail.com</a></p>
                <p><strong>Objet :</strong> "Question cookies"</p>
                <p className="mt-2 text-sm text-gray-600">
                  Nous nous engageons à répondre dans les 48h ouvrées.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Ressources utiles</h2>
              <div className="space-y-2">
                <p>
                  <strong>CNIL :</strong> 
                  <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    Guide sur les cookies
                  </a>
                </p>
                <p>
                  <strong>Commission européenne :</strong> 
                  <a href="https://ec.europa.eu/info/cookies_fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    Informations sur les cookies
                  </a>
                </p>
                <p>
                  <strong>Vos droits :</strong> 
                  <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline ml-1">
                    Politique de confidentialité
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
