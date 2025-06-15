# ChronoFlow - Déploiement avec Docker

## Guide ultra-simple pour PC portable avec Docker Desktop

### Prérequis
- Docker Desktop installé sur ton PC portable
- Compte MongoDB Atlas (gratuit) avec une base de données configurée

### Étapes

1. **Cloner/copier le projet** sur ton PC portable

2. **Vérifier le fichier `.env.docker`**
   - Assure-toi que `MONGODB_URI` contient la bonne connexion MongoDB Atlas
   - Les autres variables sont déjà configurées

3. **Construire et lancer l'application**
   ```bash
   docker-compose up --build
   ```

4. **Accéder à l'application**
   - Ouvre ton navigateur sur : `http://localhost:3030`
   - L'application ChronoFlow est maintenant accessible !

### Commandes utiles

- **Démarrer l'application** : `docker-compose up`
- **Démarrer en arrière-plan** : `docker-compose up -d`
- **Arrêter l'application** : `docker-compose down`
- **Reconstruire après modification** : `docker-compose up --build`
- **Voir les logs** : `docker-compose logs`

### Configuration MongoDB Atlas

Si tu n'as pas encore configuré MongoDB Atlas :

1. Créer un compte sur [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données
4. Autoriser les connexions (0.0.0.0/0 pour simplifier)
5. Copier l'URI de connexion dans `.env.docker`

### Dépannage

- **Erreur de port** : Si le port 3030 est occupé, modifier dans `docker-compose.yml`
- **Erreur MongoDB** : Vérifier l'URI dans `.env.docker`
- **Build qui échoue** : Supprimer les images et reconstruire :
  ```bash
  docker-compose down --rmi all
  docker-compose up --build
  ```

### Structure simple

```
chronoflow-nextjs/
├── Dockerfile              # Configuration Docker simple
├── docker-compose.yml      # Orchestration minimaliste
├── .env.docker            # Variables d'environnement
└── ...                    # Fichiers de l'application
```

