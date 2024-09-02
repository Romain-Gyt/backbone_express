const Role = require('../models/Role')

exports.createRole = async (req,res) => {
    try{
        const{name,level} = req.body;
        const role = await Role.create({name,level});
        res.status(201).json({message:'Role crée avec succès',role});
    } catch(error){
        res.status(500).json({message:'Erreur lors de la creation du role'});

    }
}

exports.getRoles = async (req,res) =>{
    try{
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error){
        res.status(500).json({message: 'Erreur lors de la recuperation des roles',error})
    }
};