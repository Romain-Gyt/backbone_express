// controllers/roleController.js
const { Role } = require('../models'); // Assure-toi que le chemin est correct

exports.createRole = async (req, res) => {
    try {
        const { name, hierarchyLevel } = req.body;
        const role = await Role.create({ name, hierarchyLevel });
        res.status(201).json({ message: 'Role créé avec succès', role });
    } catch (error) {
        console.error('Error creating role:', error); // Ajoute une journalisation des erreurs pour plus de détails
        res.status(500).json({ message: 'Erreur lors de la création du role', error });
    }
}

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error); // Ajoute une journalisation des erreurs pour plus de détails
        res.status(500).json({ message: 'Erreur lors de la récupération des rôles', error });
    }
};
