const { User, Role } = require('../models');

const authorizeRole = (requiredRoleNames) => {
    return async (req, res, next) => {
        try {
            // Vérifie si l'utilisateur est authentifié
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Trouve l'utilisateur avec son rôle inclus
            const user = await User.findByPk(req.user.id, {
                include: [
                    {
                        model: Role,
                        as: 'role'
                    }
                ]
            });

            if (!user || !user.role) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const userRole = user.role;

            // Recherche les rôles requis par nom pour obtenir leurs niveaux hiérarchiques
            const requiredRoles = await Role.findAll({
                where: {
                    name: requiredRoleNames
                }
            });

            if (requiredRoles.length === 0) {
                return res.status(400).json({ message: 'Invalid required roles' });
            }

            // Trouver le niveau minimum requis parmi les rôles
            const minLevel = Math.min(...requiredRoles.map(role => role.hierarchyLevel));

            // Si l'utilisateur a un rôle avec un niveau supérieur ou égal au niveau minimum requis
            if (userRole.hierarchyLevel >= minLevel) {
                // Si le niveau est égal au niveau requis, on vérifie aussi le nom du rôle
                if (userRole.hierarchyLevel === minLevel) {
                    if (!requiredRoleNames.includes(userRole.name)) {
                        return res.status(403).json({ message: 'Forbidden: Insufficient Role' });
                    }
                }
                // Passe au middleware suivant si le rôle est correct
                next();
            } else {
                return res.status(403).json({ message: 'Forbidden: Insufficient Level' });
            }

        } catch (error) {
            console.error('Error in role authorization middleware:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = authorizeRole;
