'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Association avec le modèle Role
            User.belongsTo(models.Role, {
                foreignKey: 'roleId',
                as: 'role',
            });
        }
    }

    // Initialisation du modèle User avec validations et timestamps automatiques
    User.init({
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: 'Le nom d\'utilisateur est obligatoire' },
                notEmpty: { msg: 'Le nom d\'utilisateur ne peut pas être vide' },
                len: {
                    args: [3, 50],
                    msg: 'Le nom d\'utilisateur doit être compris entre 3 et 50 caractères',
                },
            },
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: 'L\'email est obligatoire' },
                notEmpty: { msg: 'L\'email ne peut pas être vide' },
                isEmail: { msg: 'L\'email doit être valide' },
            },
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notNull: { msg: 'Le mot de passe est obligatoire' }
            },
        },
        isBan: {
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
        modelName: 'User',
        tableName: 'users',
        timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
        paranoid: true //active le soft delete
    });

    return User;
};
