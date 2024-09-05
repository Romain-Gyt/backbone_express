
    module.exports = (sequelize, DataTypes) => {
        const Role = sequelize.define('Role', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            hierarchyLevel: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1, // Niveau de hiérarchie par défaut pour les rôles
            }
        });

        // Association avec le modèle User
        Role.associate = (models) => {
            Role.hasMany(models.User, {
                foreignKey: 'roleId', // Lier le rôle avec les utilisateurs via 'roleId'
                as: 'users',
            });
        };

        return Role;
    };