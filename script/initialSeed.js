const { sequelize, Role } = require('../models'); // Assure-toi que les modèles sont correctement importés

const seedRoles = async () => {
    try {
        // Vérifier l'existence des rôles
        const roles = await Role.findAll();
        if (roles.length === 0) {
            console.log('Seeding roles...');
            await Role.bulkCreate([
                { name: 'ROLE_USER', hierarchyLevel: 1 },
                { name: 'ROLE_ADMIN', hierarchyLevel: 3 }
            ]);
            console.log('Roles seeded successfully');
        } else {
            console.log('Roles already exist');
        }
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

const runInitialSeed = async () => {
    try {
        await sequelize.sync(); // Assure-toi que les tables sont synchronisées
        await seedRoles();
        console.log('Initial seed completed successfully');
    } catch (error) {
        console.error('Error running initial seed:', error);
        throw error; // Propager l'erreur pour qu'elle puisse être capturée par l'appelant
    }
};

// Exporter la fonction pour qu'elle puisse être utilisée ailleurs
module.exports = {
    runInitialSeed
};
