const User = require('../models/User');
const Role = require('../models/Role')
let rolesCache= {};
const authorizeRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            // Vérifiez que `req.user.id` est bien défini (provenant du middleware d'authentification)
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }

            // Recherchez l'utilisateur avec ses rôles
            const user = await User.findByPk(req.user.id, { include: 'Role' });
            if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

            // Vérifiez le niveau du rôle de l'utilisateur
            const userLevel = getRoleLevel(user.Role.name);
            const requiredLevel = getRoleLevel(requiredRole);

            if (userLevel >= requiredLevel) {
                next(); // Autorisez l'accès
            } else {
                res.status(403).json({ message: 'Interdiction : Vous n\'avez pas les autorisations nécessaires' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erreur d\'autorisation de rôle', error });
        }
    };
};

const loadRoles = async () => {
    const roles = await Role.findAll();
    roles.forEach(role => {
        rolesCache[role.name] = role.level;
    });
};

const getRoleLevel = (role) => {
    return rolesCache[role] || 0; // Retourne 0 si le rôle n'existe pas
};

module.exports = { authorizeRole, loadRoles };
