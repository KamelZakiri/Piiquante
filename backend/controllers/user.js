const bcrypt = require('bcrypt');
//La méthode compare de bcrypt compare un string avec un hash pour, par exemple, vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données.
const User = require('../models/user');

const jwt = require('jsonwebtoken')

// Pour SIGN UP
exports.signup = (req, res, next) => {
// On appelle le bcrypt pour qu'il **** le mot de passe sur 10 tours(+ de tours = + temps)
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
//on récupe le hash et on établi la const pour le new user pour le save dans la bdd comme sa le mdp et save mais en hash pour pas de hack
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


// Login = déja existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
// si l'user n'exite pas 
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
// si login ou mdp incorrrect
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
//Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
                        token: jwt.sign(
                            { userId: user._id },
//Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token
                            'RANDOM_TOKEN_SECRET',
//Nous définissons la durée de validité du token à 24 heures.
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };