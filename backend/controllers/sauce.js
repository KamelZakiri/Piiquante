// Le controllers stock la logique métier du CRUD qui est appliquer pr le site

const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(req.body,"body")
  console.log(sauceObject,"object")

  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};


  exports.modifySauce = (req, res, next) => {
// //Permet de modifier la sauce en controlant avec update one que c le bon id et le reste permet la modif de tt le ( sauce
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then (sauce => {
// si le user correspond au token auth sa va split l'image sinon not authorized
            if  (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
// grace a fs je peut modifier les images aux dossiers si le user la supp elle sera supp de la bdd
                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

  exports.getOneSauce = (req, res, next) => {
// // :id sert a rendre le lien dynamique en indiquant juste apres avec params id l'endroit ou chercher l'id
    Sauce.findOne({ _id: req.params.id })
      .then ( sauce => res.status(200).json ( sauce))
      .catch(error => res.status(404).json({ error }));
  };

  exports.allSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

  // "liker"ou "disliker" une sauce

  exports.likes = (req, res) => {
    Sauce.findById(req.params.id)
      .then(sauce => {
        switch (req.body.like) {
          case 0:
            // Check si l'utilisateur a le droit de liker la sauce ou non
            if (sauce.usersLiked.includes(req.auth.userId)) {
              const indexOfUser = sauce.usersLiked.indexOf(req.auth.userId);
              Sauce.findByIdAndUpdate(req.params.id, {
                ...sauce,
                likes: sauce.likes--,
                // fait en sorte que l'user ne like pas 2 fois la même sauce
                usersLiked: sauce.usersLiked.splice(indexOfUser, 1),
              })
                .then(() => res.status(200).json({ message: 'Sauce unliked' }))
                .catch(error => res.status(401).json({ error }));
            }
            if (sauce.usersDisliked.includes(req.auth.userId)) {
              const indexOfUser = sauce.usersDisliked.indexOf(req.auth.userId);
              Sauce.findByIdAndUpdate(req.params.id, {
                ...sauce,
                dislikes: sauce.dislikes--,
                usersDisliked: sauce.usersDisliked.splice(indexOfUser, 1),
              })
                .then(() => res.status(200).json({ message: 'Sauce undisliked' }))
                .catch(error => res.status(401).json({ error }));
            }
            break;
          case 1:
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              likes: sauce.likes++,
              usersLiked: sauce.usersLiked.push(req.auth.userId),
            })
              .then(() => res.status(200).json({ message: 'Sauce liked !' }))
              .catch(error => res.status(401).json({ error }));
            break;
          case -1:
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              dislikes: sauce.dislikes++,
              usersDisliked: sauce.usersDisliked.push(req.auth.userId),
            })
              .then(() => res.status(200).json({ message: 'Sauce disliked...' }))
              .catch(error => res.status(401).json({ error }));
            break;
        }
      })
      .catch(error => res.status(401).json({ error }));
  };