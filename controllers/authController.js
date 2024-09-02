const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req,res) =>{
    try{
        const{ username,email,password} = req.body;
        console.log('Received request to register:', { username, email });

        //On verifie si l'utilisateur existe deja
        const existingUser = await User.findOne({
            where: {
                email: email // ou utilisez `email` directement si vous avez une variable avec le même nom
            }
        });

        if(existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant'});

        //Hashage le mot de passe
        const hashedPassword = await bcrypt.hash(password,10);
        console.log('Création de l\'utilisateur avec les données :', { username, email, password: hashedPassword });
        //Creation du nouvel utilisateur
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({message: 'Utilisateur crée avec succès', user: newUser})
    } catch(error){
        res.status(500).json({error: 'Erreur lors de l\'inscription'});
    }
}

exports.login = async (req,res) => {
    try{
        const{ email,password } = req.body;

        const user = await User.findOne({where: {email} });

        if(!user) return res.status(404).json({message: 'Utilisateur non trouvé'});

        //on compare les mots de passe
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword) return res.status(404).json({message: 'Email ou mot de passe incorrect'});

        //On génère un token jwt
        const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET,{expiresIn: '1H'});
        res.status(200).json({message: 'Connexion réussie',token});

    } catch(error){
        res.status(500).json({message: 'Erreur lors de la connexion'});
    }
}
