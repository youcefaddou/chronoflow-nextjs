import { CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

// Composant pour les boutons d'action optimisés
export function ProductCTAButton({ href, variant = 'primary', children, className = '', onClick, ...props }) {
  const baseClasses = "inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600",
    white: "bg-white text-blue-600 hover:bg-gray-100"
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  // Si onClick est fourni, rendu en tant que bouton
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={classes}
        {...props}
      >
        {children}
      </button>
    )
  }

  // Si href est fourni, rendu en tant que lien
  if (href) {
    return (
      <Link 
        href={href}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    )
  }

  // Fallback en tant que bouton
  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

// Composant pour les cartes de fonctionnalités
export function FeatureCard({ icon, title, description, benefits, reverse = false, children }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={reverse ? 'lg:col-start-2' : ''}>
        <div className="flex items-center mb-6">
          {icon}
          <h3 className="text-2xl font-bold text-gray-900 ml-4">{title}</h3>
        </div>
        
        <p className="text-lg text-gray-600 mb-6">{description}</p>

        {benefits && (
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={reverse ? 'lg:col-start-1' : ''}>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
          <div className="bg-white rounded-xl shadow-md p-6">
            {children || (
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  {icon}
                  <p className="text-gray-500 mt-2 text-sm">Aperçu de la fonctionnalité</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour les statistiques
export function StatCard({ value, label, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600', 
    purple: 'text-purple-600'
  }

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

// Composant pour les témoignages
export function TestimonialCard({ text, author, role, rating = 5 }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-start mb-4">
        <div className="flex text-yellow-400">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
      </div>
      <blockquote className="text-gray-700 mb-4 italic">
        "{text}"
      </blockquote>
      <div>
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-gray-600 text-sm">{role}</div>
      </div>
    </div>
  )
}
