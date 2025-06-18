# Système de Limitations de Plan - Documentation

## Vue d'ensemble

Ce système implémente des limitations basées sur les plans d'abonnement (gratuit/pro/business) pour contrôler l'usage des fonctionnalités de ChronoFlow.

## Architecture

### Frontend
- **Hook principal**: `hooks/use-plan-limits.js` - Centralise la logique de limitation côté client
- **Composants d'alerte**: `components/common/plan-limit-alert.jsx` - Interface utilisateur pour les notifications de limite
- **Intégration dans les modales**: Vérification des limites avant création/export

### Backend  
- **Logique serveur**: `lib/plan-limits-server.js` - Vérifications sécurisées côté serveur
- **Modèles MongoDB**: 
  - `models/task.js` - Tâches utilisateur avec index optimisé
  - `models/export.js` - Suivi des exports avec timestamps
  - `models/user.js` - Données d'abonnement utilisateur

### Base de données
- **Script d'indexation**: `scripts/setup-plan-limits-indexes-mongoose.js`
- **Optimisations**: Index sur `userId`, `createdAt`, `subscription.plan`

## Limitations par Plan

### Plan Gratuit (free)
- **Tâches**: 5 maximum
- **Exports par mois**: 1 maximum
- **Fonctionnalités**: Basiques seulement

### Plan Pro (pro) 
- **Tâches**: Illimitées
- **Exports**: Illimités
- **Fonctionnalités**: Toutes disponibles

### Plan Business (business)
- **Tâches**: Illimitées  
- **Exports**: Illimités
- **Fonctionnalités**: Toutes disponibles + équipes

## Installation et Configuration

### 1. Indexation de la base de données
```bash
npm run setup-indexes
```

### 2. Variables d'environnement requises
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. API Routes disponibles
- `POST /api/record-export` - Enregistrer un export (utilisé automatiquement)
- Autres API routes avec middleware de limitation (exemples fournis)

## Utilisation

### Frontend - Vérification des limites
```javascript
import usePlanLimits from '../hooks/use-plan-limits'

function MyComponent() {
  const { canCreateTask, canExport, getLimitMessage } = usePlanLimits()
  
  const handleCreateTask = () => {
    if (!canCreateTask()) {
      // Afficher message de limite
      return
    }
    // Créer la tâche
  }
}
```

### Backend - Middleware de protection
```javascript
import { checkTaskCreationLimit } from '../lib/plan-limits-server'

// Dans votre API route
export const POST = checkTaskCreationLimit()(async (req, res) => {
  // Logique de création de tâche
})
```

## Flux de Données

### Création de Tâche
1. Frontend vérifie `canCreateTask()`
2. Si limite atteinte → Affichage modal d'upgrade
3. Sinon → Appel API avec middleware serveur
4. Serveur vérifie à nouveau les limites
5. Création si autorisée

### Export
1. Frontend vérifie `canExport()`
2. Export réalisé si autorisé
3. Appel automatique à `/api/record-export`
4. Mise à jour des statistiques côté client

## Sécurité

- **Double vérification**: Frontend + Backend pour UX et sécurité
- **Requêtes optimisées**: Index MongoDB pour performances
- **Gestion d'erreurs**: Fallback gracieux en cas d'échec de vérification

## Tests et Développement

### Tester les limitations
1. Créer un utilisateur avec plan gratuit
2. Créer 5 tâches → Vérifier blocage à la 6ème
3. Faire 1 export → Vérifier blocage au 2ème
4. Upgrade vers Pro → Vérifier déblocage

### Debugging
- Logs dans `lib/plan-limits-server.js`
- Network tab pour vérifier appels API
- Console pour messages de limitation

## Maintenance

### Mise à jour des limites
Modifier `PLAN_LIMITS` dans `lib/plan-limits-server.js` et `hooks/use-plan-limits.js`

### Nettoyage des exports
Les exports sont horodatés, possibilité d'ajouter un cleanup automatique si besoin.

### Monitoring
Surveiller les performances des requêtes MongoDB via les index créés.
