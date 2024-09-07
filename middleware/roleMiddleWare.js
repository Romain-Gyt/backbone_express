const { User, Role } = require('../models');

/**
 * Middleware pour autoriser les utilisateurs en fonction de leurs rôles et niveau hiérarchique.
 *
 * @param {Array<String>} requiredRoleNames - La liste des noms de rôles requis pour l'accès.
 * @returns {Function} Fonction middleware pour l'autorisation basée sur les rôles.
 */
const authorizeRole = (requiredRoleNames) => {
    return async (req, res, next) => {
        try {
            // Vérifier si l'utilisateur est authentifié et a un ID
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Récupérer l'utilisateur authentifié avec son rôle associé
            const user = await getUserWithRole(req.user.id);

            if (!user || !user.role) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Récupérer les rôles requis et trouver le niveau hiérarchique minimum
            const minLevel = await getMinLevelOfRequiredRoles(requiredRoleNames);

            if (minLevel === null) {
                return res.status(400).json({ message: 'Rôles requis invalides' });
            }

            // Vérifier si le niveau hiérarchique du rôle de l'utilisateur est suffisant
            if (isUserAuthorized(user.role, requiredRoleNames, minLevel)) {
                next(); // Utilisateur autorisé
            } else {
                res.status(403).json({ message: 'Interdit : Niveau ou rôle insuffisant' });
            }

        } catch (error) {
            console.error('Erreur dans le middleware d\'autorisation de rôle:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };
};

/**
 * Fonction d'assistance pour récupérer un utilisateur avec son rôle inclus.
 *
 * @param {Number} userId - L'ID de l'utilisateur à récupérer.
 * @returns {Object} L'utilisateur avec son rôle associé.
 */
const getUserWithRole = async (userId) => {
    return await User.findByPk(userId, {
        include: [
            {
                model: Role,
                as: 'role',
            }
        ]
    });
};

/**
 * Fonction d'assistance pour trouver le niveau hiérarchique minimum parmi les rôles requis.
 *
 * @param {Array<String>} requiredRoleNames - La liste des noms de rôles requis.
 * @returns {Number|null} Le niveau hiérarchique minimum parmi les rôles requis, ou null si les rôles sont invalides.
 */
const getMinLevelOfRequiredRoles = async (requiredRoleNames) => {
    const requiredRoles = await Role.findAll({
        where: {
            name: requiredRoleNames
        }
    });

    if (requiredRoles.length === 0) {
        return null; // Rôles invalides
    }

    // Trouver le niveau hiérarchique minimum parmi les rôles requis
    return Math.min(...requiredRoles.map(role => role.hierarchyLevel));
};

/**
 * Fonction d'assistance pour vérifier si un utilisateur est autorisé en fonction de son rôle.
 *
 * @param {Object} userRole - Le rôle de l'utilisateur.
 * @param {Array<String>} requiredRoleNames - La liste des noms de rôles requis.
 * @param {Number} minLevel - Le niveau hiérarchique minimum requis.
 * @returns {Boolean} Si l'utilisateur est autorisé ou non.
 */
const isUserAuthorized = (userRole, requiredRoleNames, minLevel) => {
    if (userRole.hierarchyLevel > minLevel) {
        return true; // L'utilisateur a un rôle de niveau supérieur
    } else if (userRole.hierarchyLevel === minLevel) {
        return requiredRoleNames.includes(userRole.name); // Vérifier le nom du rôle si le niveau est le même
    }
    return false;
};

module.exports = authorizeRole;
