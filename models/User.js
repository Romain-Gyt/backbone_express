const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');
const Role = require('./Role')

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null, // Optionnel, pour plus de clarté
    }
},{
    tableName: 'users'
});

User.belongsTo(Role,{foreignKey: 'roleId'});
Role.hasMany(User,{foreignKey:'roleId'})
module.exports = User;
