'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {0
            // Association avec le modèle User
            Role.hasMany(models.User, {
                foreignKey: 'roleId', // Clé étrangère reliant le rôle aux utilisateurs
                as: 'users',
            });
        }
    }

    Role.init({
        name: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom du rôle est obligatoire' },
                notEmpty: { msg: 'Le nom du rôle ne peut pas être vide' },
                len: {
                    args: [5, 15],
                    msg: 'Le nom du rôle doit comporter entre 5 et 15 caractères',
                },
            },
        },
        hierarchyLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                isInt: { msg: 'Le niveau de hiérarchie doit être un entier' },
                min: {
                    args: 1,
                    msg: 'Le niveau de hiérarchie doit être supérieur ou égal à 1',
                },
            },
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: true,
        paranoid: true
    });

    return Role;
};
