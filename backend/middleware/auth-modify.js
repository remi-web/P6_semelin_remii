const Sauce = require('../models/Sauces');
const jwt = require('jsonwebtoken');

// Authentification pour supprimer ou modifier

module.exports = ( req, res, next) => {

    try {  
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        Sauce.findOne({_id: req.params.id})  
            .then(sauce => {
                if (sauce.userId != userId) {   
                    res.status(401).send({ error: 'Acces non authorisé' });
                }
                else{
                    next ()
                }
            })
            .catch(error => res.status(404).json({ error: "Objet introuvable" }));
    }
    catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        })
    }
}


    
      

    