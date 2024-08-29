const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialisation de Sequelize avec PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à PostgreSQL réussie.');
    } catch (error) {
        console.error('Erreur de connexion :', error);
    }
};

module.exports = { sequelize, connectDB };
