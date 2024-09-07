const { User, Role } = require('../models');

/**
 * Middleware to authorize users based on their roles and hierarchy level.
 *
 * @param {Array<String>} requiredRoleNames - The list of required role names for access.
 * @returns {Function} Middleware function for role-based authorization.
 */
const authorizeRole = (requiredRoleNames) => {
    return async (req, res, next) => {
        try {
            // Check if the user is authenticated and has an ID
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Fetch the authenticated user with their associated role
            const user = await getUserWithRole(req.user.id);

            if (!user || !user.role) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Fetch required roles and find the minimum hierarchy level
            const minLevel = await getMinLevelOfRequiredRoles(requiredRoleNames);

            if (minLevel === null) {
                return res.status(400).json({ message: 'Invalid required roles' });
            }

            // Check if the user's role hierarchy level is sufficient
            if (isUserAuthorized(user.role, requiredRoleNames, minLevel)) {
                next(); // User is authorized
            } else {
                res.status(403).json({ message: 'Forbidden: Insufficient Level or Role' });
            }

        } catch (error) {
            console.error('Error in role authorization middleware:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

/**
 * Helper function to fetch a user with their role included.
 *
 * @param {Number} userId - The ID of the user to fetch.
 * @returns {Object} The user with their associated role.
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
 * Helper function to find the minimum hierarchy level among the required roles.
 *
 * @param {Array<String>} requiredRoleNames - The list of required role names.
 * @returns {Number|null} The minimum hierarchy level among the required roles, or null if roles are invalid.
 */
const getMinLevelOfRequiredRoles = async (requiredRoleNames) => {
    const requiredRoles = await Role.findAll({
        where: {
            name: requiredRoleNames
        }
    });

    if (requiredRoles.length === 0) {
        return null; // Invalid roles
    }

    // Find the minimum hierarchy level among the required roles
    return Math.min(...requiredRoles.map(role => role.hierarchyLevel));
};

/**
 * Helper function to check if a user is authorized based on their role.
 *
 * @param {Object} userRole - The role of the user.
 * @param {Array<String>} requiredRoleNames - The list of required role names.
 * @param {Number} minLevel - The minimum hierarchy level required.
 * @returns {Boolean} Whether the user is authorized.
 */
const isUserAuthorized = (userRole, requiredRoleNames, minLevel) => {
    if (userRole.hierarchyLevel > minLevel) {
        return true; // User has a higher level role
    } else if (userRole.hierarchyLevel === minLevel) {
        return requiredRoleNames.includes(userRole.name); // Check role name if level is the same
    }
    return false;
};

module.exports = authorizeRole;
