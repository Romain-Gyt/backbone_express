
const express = require('express');
const { connectDB } = require('./config/db')
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();//charge les variables d'environnement
const app = express();
const PORT = process.env.PORT || 5000 ;  // Défini le port à partir de l'environnement ou utilise le port 4000 par défaut
// Middleware
app.use(cors());  // Activer les CORS
app.use(express.json());  // Pour pouvoir lire les données JSON dans les requêtes

//connexio db
connectDB();

// Routes simples pour tester l'API
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Granite & Goélettes GHFH!' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
});
