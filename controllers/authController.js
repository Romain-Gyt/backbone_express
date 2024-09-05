const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Assure-toi que User et Role sont importés correctement

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body; // Retire roleId de la requête
        console.log('Received request to register:', { username, email });

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant' });

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // Assigner le rôle par défaut avec le nom ROLE_USER
        const defaultRoleName = 'ROLE_USER';

        // Trouver le rôle par nom
        const role = await Role.findOne({
            where: { name: defaultRoleName }
        });

        if (!role) return res.status(400).json({ message: 'Role non valide' });

        // Création du nouvel utilisateur avec roleId par défaut
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: role.id // Utiliser l'id du rôle trouvé
        });

        console.log('User creation result:', newUser);

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // Comparer les mots de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(404).json({ message: 'Email ou mot de passe incorrect' });

        // Générer un token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1H' });
        res.status(200).json({ message: 'Connexion réussie', token });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};
