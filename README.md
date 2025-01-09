# Tix API

API de gestion de billets et d'événements permettant la création, la réservation et le suivi des événements.

## 🚀 Fonctionnalités

- Gestion des événements
- Réservation de billets
- Authentification sécurisée
- Gestion des utilisateurs

## 📋 Prérequis

- Node.js >= 16
- MongoDB
- npm ou yarn

## ⚙️ Installation

```bash
# Cloner le dépôt
git clone https://github.com/Elyter/tix-API.git

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer le serveur
npm run dev
```

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tix-api
JWT_SECRET=votre_secret
```

## 📚 Documentation API

La documentation de l'API est disponible sur `/api/docs`

## 🧪 Tests

```bash
# Lancer les tests
npm run test

# Couverture des tests
npm run test:coverage
```

## 📝 Licence

MIT
