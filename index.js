
const express = require('express');
const { connectDB } = require('./config/db')
const cors = require('cors');
const dotenv = require('dotenv');
const  seed  = require('./script/initialSeed');
dotenv.config();//charge les variables d'environnement
const app = express();
const PORT = process.env.PORT || 5000 ;  // Défini le port à partir de l'environnement ou utilise le port 4000 par défaut

// Middleware
app.use(cors());  // Activer les CORS
app.use(express.json());  // Pour pouvoir lire les données JSON dans les requêtes

//

//connexion db
connectDB();

// Routes simples pour tester l'API
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Granite & Goélettes! A la date du ' + new Date + ' , le site est toujours en production' });
});
//Route
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/users',require('./routes/userRoutes'));
app.use('/api/role',require('./routes/roleRoutes'));

seed.runInitialSeed().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to run initial seed:', err);
    process.exit(1); // Quitter le processus en cas d'erreur
})

