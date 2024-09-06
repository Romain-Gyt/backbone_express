const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// Fonction pour valider le mot de passe
const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
        throw new Error('Le mot de passe doit contenir entre 8 et 16 caractères');
    }
    if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^\&*\)\(+=._-])/.test(password)) {
        throw new Error('Le mot de passe doit comporter au moins une majuscule, un chiffre et un caractère spécial');
    }
};

// Fonction pour hasher le mot de passe
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Fonction pour trouver un rôle par nom
const findRoleByName = async (roleName) => {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
        throw new Error('Rôle non valide');
    }
    return role;
};

// Fonction d'inscription
const registerUser = async (username, email, password) => {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Utilisateur déjà existant');
    }

    // Validation du mot de passe
    validatePassword(password);

    // Hashage du mot de passe
    const hashedPassword = await hashPassword(password);

    // Assigner le rôle par défaut avec le nom ROLE_USER
    const defaultRoleName = 'ROLE_USER';
    const role = await findRoleByName(defaultRoleName);

    // Création du nouvel utilisateur avec roleId par défaut
    return User.create({
        username,
        email,
        password: hashedPassword,
        roleId: role.id
    });
};

// Fonction de connexion
const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    // Comparer les mots de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1H' });
    return token;
};

module.exports = {
    registerUser,
    loginUser,
};
