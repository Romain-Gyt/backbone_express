# BackBone Backend

## Description

Basé sur Node.js, conçu avec Express.js et Sequelize. Il est conçu pour être réutilisé comme une architecture de base (backbone) pour d'autres projets.

### Fonctionnalités principales

- Authentification avec JWT
- Gestion des utilisateurs et des rôles
- Autorisations basées sur des rôles avec niveaux hiérarchiques
- API CRUD pour les utilisateurs et les rôles
- Compatibilité avec plusieurs moteurs de base de données via Sequelize

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) - Version 14.x ou supérieure
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) - Gestionnaire de paquets
- Un moteur de base de données pris en charge :
    - MariaDB
    - PostgreSQL
    - MySQL
    - SQLite (pour des tests locaux)

## Installation

### Étape 1 : Cloner le projet

Clonez le dépôt sur votre machine locale et accédez au dossier du projet.

```bash
git clone https://github.com/Romain-Gyt/backbone_express.git
cd backbone_express
```

### Étape 2 : Installer les dependances
git config --global user.name
npm install


### Étape 3 : Creation a la racine du fichier .env

- DB_HOST= *Adresse de votre serveur de base de données (ex : localhost)*
- DB_PORT= *Port utilisé par votre base de données (ex : 3306 pour MariaDB)*
- DB_USER= *Nom d'utilisateur de la base de données*
- DB_PASSWORD=*Mot de passe de la base de données*
- DB_NAME=*Nom de la base de données*
- PORT=*Port sur lequel le serveur Express écoutera (ex : 4000)*
- DB_DIALECT=*Dialecte de la base de données (mariadb, postgres, mysql, sqlite, etc.)*
- JWT_SECRET=* Clé secrète utilisée pour la signature des tokens JWT*
- NODE_ENV=* Environnement d'exécution (development, production,production)*


### Étape 4 : Lancer le serveur

```bash
npm start
```
( lance le serveur avec nodemon, le script est dans package.json)
#### Arborescence du projet

backone-backend/

├── config/

│   ├── config.js # Fichier de configuration de la base de données

│   ├── db.js                # Connection à la base de données

├── controllers/

│   ├── authController.js # Contrôleur pour l'authentification

│   ├── roleController.js    # Contrôleur pour la gestion des rôles

│   ├── userController.js    # Contrôleur pour les utilisateurs

├── middlewares/

│   ├── authorizeRole.js     # Middleware pour la gestion des autorisations basées sur les rôles

│   ├── authMiddleware.js    # Middleware pour l'authentification des utilisateurs

├── migrations/              # Dossier contenant les migrations Sequelize pour créer la base de données

├── models/

│   ├── User.js              # Modèle utilisateur

│   ├── Role.js              # Modèle rôle

├── routes/

│   ├── authRoutes.js        # Routes d'authentification

│   ├── roleRoutes.js        # Routes pour la gestion des rôles

│   ├── userRoutes.js        # Routes pour la gestion des utilisateurs

├── script/

│   ├── initialSeed.js       # Script pour créer les rôles ROLE_USER et ROLE_ADMIN en base

├── service/

│   ├── authService.js       # Service appelé par le contrôleur authController.js pour login et register

├── .env                     # Fichier de configuration des variables d'environnement

├── index.js                 # Point d'entrée principal de l'application

└── README.md                # Documentation du projet



## Documentation des routes

### Authentification
- POST /api/auth/register : Enregistre un nouvel utilisateur
  Paramètres requis : username, email, password
- POST /api/auth/login : Connecte un utilisateur
  Paramètres requis : email, password

### Gestion des rôles
- POST /api/roles : Crée un nouveau rôle
  Paramètres requis : name, hierarchyLevel
- GET /api/roles : Récupère tous les rôles
  Réponse :

### Gestion des Profils
- Route a créer selon vos besoins

## Gestion des rôles et autorisations

Le middleware authorizeRole permet de gérer les autorisations sur les routes en fonction des rôles et de leur niveau hiérarchique.

### Exemple d'utilisation dans une route protégée :

```Javascript
const authenticate = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/authorizeRole');

router.use(authenticate);

app.get('/admin', authorizeRole(['ROLE_ADMIN']), (req, res) => {
    res.json({ message: 'Bienvenue, administrateur !' });
});
```

Le middleware fonctionne de la manière suivante :

Il vérifie si l'utilisateur a un rôle avec un niveau supérieur ou égal à celui requis.
Si le niveau est égal au niveau requis, il vérifie également que le nom du rôle correspond à celui requis.

## Documentation des migrations

Les migrations sont utilisées pour gérer les modifications de la structure de la base de données de manière contrôlée. Voici comment utiliser les migrations avec Sequelize :

#### Créer une migration

Pour créer une nouvelle migration, utilisez la commande suivante :
```Bash
npx sequelize-cli migration:generate --name <nom-de-la-migration>
```
Remplacez ``<nom-de-la-migration>`` par un nom descriptif pour votre migration.

#### Exécuter les migrations
Pour appliquer les migrations à votre base de données, utilisez la commande suivante:
```Bash
npx sequelize-cli db:migrate
```
#### Revenir à la dernière migration
Pour annuler la dernière migration appliquée, utilisez:
```bash
npx sequelize-cli db:migrate:undo
```
### Revenir à toutes les migrations
Pour annuler toutes les migrations, utilisez:
```Bash
npx sequelize-cli db:migrate:undo:all
```

## Gestion des environnements de travail
### Configuration automatique avec ``config.js`` et variable d'environnement

Le projet utilise un fichier config.js pour gérer les différentes configurations d'environnement (développement, test, production). Cette approche permet une meilleure flexibilité en s'appuyant sur les variables d'environnement définies dans un fichier .env, plutôt que sur des fichiers de configuration statiques comme config.json. Cela facilite le passage entre différents environnements sans avoir à modifier manuellement les fichiers de configuration.

#### Avantage
- Flexibilité : Il devient très facile de changer les paramètres de configuration simplement en modifiant le fichier ``.env`` en fonction de l'environnement (local, CI/CD, production).
- Sécurité : Les informations sensibles comme les mots de passe ne sont pas codées en dur dans le code source. Elles sont plutôt extraites des variables d'environnement.
- Simplicité : Le même fichier de configuration est utilisé pour tous les environnements, ce qui réduit la complexité et minimise le risque d'erreurs.
## Scripts disponibles

``npm start``: lancer le serveur avec nodemon.

## Technologies utilisées

- Node.js
- Express.js
- Sequelize (ORM)
- MariaDB / PostgreSQL / MySQL / SQLite
- JWT pour la gestion de l'authentification
- Bcrypt pour le hachage des mots de passe
