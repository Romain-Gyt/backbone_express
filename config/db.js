const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialisation de Sequelize avec MariaDB
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb', // Changer 'postgres' en 'mariadb'
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à MariaDB réussie.');
    } catch (error) {
        console.error('Erreur de connexion :', error);
    }
};

module.exports = { sequelize, connectDB };
