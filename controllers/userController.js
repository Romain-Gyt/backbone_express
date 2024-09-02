const User = require('../models/User')

exports.getUser = async (req,res) => {
    try{
        const user = await User.findByPk(req.user.id);
        console.log(user)
        if(!user) return res.status(404).json({message: 'Utilisateur non trouvé'})
        return res.status(200).json(user);
    } catch(error){
        res.status(500).json({error: 'Erreur lors de la récupération de l\'utilisateur'});
    }
}