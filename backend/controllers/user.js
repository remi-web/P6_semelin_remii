const bcrypt = require ('bcrypt');
const response = require('../app');
const jwt = require('jsonwebtoken');

const passWordValidate = require('../models/Validators')
const validation = passWordValidate.passWordValidator

const User = require('../models/Users');
 
exports.signup = (req, res, next) => {
    let validate = validation.validate(req.body.password)
    if(validate === true){
        
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ messsage: 'Utilisateur créé'}))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ message: "problème" }))
    }
    else{
        console.log('mot de passe trop faible !!!')
        user.catch(error => res.status(401)).json({ message: "erreur mot de passe"})

    }     
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                })
            })
        })
        .catch(error => res.status(500).json({ error }))
};