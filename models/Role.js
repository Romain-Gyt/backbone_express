const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db')

const Role = sequelize.define('Role',{
    name:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    level:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName:'roles'
})

module.exports= Role;