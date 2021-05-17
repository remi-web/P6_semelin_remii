const Sauce = require('../models/Sauces');
const fs = require('fs')

exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({ ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
    sauce.likes = 0
    sauce.dislikes = 0  
    sauce.save()
        .then(() => res.status(201).json({sauce}))
        .catch(error => res.status (400).json({ error }))
};

exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id }, )
        .then(() => res.status(200).json({message : "Objet modifié"}))
        .catch(error => res.status (400).json({ error }));
};

exports.deleteSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error =>  res.status(500).json({ error }))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.likedSauce = (req, res, next) => {
  const userId = req.body.userId

    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        switch (req.body.like){
          // si l'utilisateur aime la sauce
          case 1:
            Sauce.updateOne(
              {_id: req.params.id},
              {$inc:{likes: 1},$push: {usersLiked: userId}})
            .then(() => res.status(200).json({ message: "aimé"}))
            .catch(error => res.status(400).JSON({ error })
            );
          break
          
          // si l'utilisateur enlève son like ou son disLike
          case 0:
            const usersLiked = sauce.usersLiked
            usersLiked.forEach(userIdLiked => {
              if( userIdLiked === userId ){
                Sauce.updateOne(
                  { _id: req.params.id},
                  {$inc:{likes: -1}, $pull:{usersLiked: userId}})
                  .then(() => res.status(200).json({ message: "sans avis "}))
                  .catch(error => res.status(400).JSON({ error })
                );
              }
            });
            const usersDisliked = sauce.usersDisliked
            usersDisliked.forEach(userIdDisliked => {
              if( userIdDisliked === userId ){
                Sauce.updateOne(
                  { _id: req.params.id},
                  {$inc:{dislikes: -1}, $pull:{usersDisliked: userId}})
                  .then(() => res.status(200).json({ message: "sans avis "}))
                  .catch(error => res.status(400).JSON({ error })
                );
              }       
            });
          break
          //  Si l'utilisateur n'aime pas la sauce
          case -1:
            Sauce.updateOne(
              { _id: req.params.id},
              {$push: {usersDisliked: userId}, $inc:{dislikes: 1}}
            )
            .then(() => res.status(200).json({ message: "pas aimé"}))
            .catch(error => res.status(400).JSON({ error }));
          break
        }
      })
      .catch(error => res.status(404).json({ message : "objet non trouvé"}))
}; 

       


