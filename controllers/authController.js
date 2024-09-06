const { registerUser, loginUser } = require('../service/authService');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Appeler le service pour l'inscription
        const newUser = await registerUser(username, email, password);

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        // Gérer les erreurs et envoyer une réponse appropriée
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Appeler le service pour la connexion
        const token = await loginUser(email, password);

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        // Gérer les erreurs et envoyer une réponse appropriée
        res.status(400).json({ message: error.message });
    }
};
