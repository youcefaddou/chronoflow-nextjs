# Système de Limitations - Guide Simple

## 🎯 C'est quoi ?

Votre app limite les utilisateurs gratuits :
- **5 tâches maximum**
- **1 export par mois**

## 🔧 Setup (une seule fois)

1. **Variables d'environnement** - Vérifiez votre `.env.local` :
```env
MONGODB_URI=votre_string_de_connexion_mongodb
```

2. **Index MongoDB** (pour la performance) :
```bash
npm run setup-indexes
```

## 📁 Code organisé

- **Frontend** : `hooks/use-plan-limits.js` + alertes dans les modales
- **Backend** : `lib/plan-limits-server.js` pour la sécurité
- **Base** : Index sur `Task.userId` et `Export.userId` pour compter rapidement

## 🚀 Comment ça marche

1. Utilisateur veut ajouter une tâche
2. Frontend vérifie : "A-t-il déjà 5 tâches ?"
3. Si oui → Affiche alerte pour upgrade
4. Backend vérifie aussi (sécurité)

C'est tout ! 🎉

**Pourquoi les scripts d'index ?**
Sans eux, compter les tâches devient lent avec beaucoup d'utilisateurs.
Avec eux → Performance optimale ⚡
