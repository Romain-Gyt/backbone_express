    const jwt = require('jsonwebtoken');
    require('dotenv').config();  // Pour charger les variables d'environnement depuis le fichier .env

    const authMiddleware = (req, res, next) => {
        // Récupérer le token d'authentification depuis les en-têtes de la requête
        const token = req.header('Authorization');
        // Vérifier si le token est présent
        if (!token) {
            return res.status(401).json({ message: 'Accès refusé : Aucun token fourni' });
        }

        try {
            // Vérifier et décoder le token
            const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
            req.user = decoded; // Assigner les données décodées à req.user pour utilisation dans les contrôleurs

            // Passer à la route suivante si tout est correct
            next();
        } catch (error) {
            // Si le token est invalide ou a expiré
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
    };

    module.exports = authMiddleware;
