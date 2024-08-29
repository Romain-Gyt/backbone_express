require('dotenv').config();  // Charger les variables d'environnement
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;  // Défini le port à partir de l'environnement ou utilise le port 4000 par défaut

// Middleware
app.use(cors());  // Activer les CORS
app.use(express.json());  // Pour pouvoir lire les données JSON dans les requêtes

// Routes simples pour tester l'API
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Granite & Goélettes!' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
});
