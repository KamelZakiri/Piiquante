const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// On met le schema pour l'authentification de l'utilisateur
const userSchema = mongoose.Schema({
// Unique car on veut pas que le meme mail s'inscrit 2 fois + utilisation du plugin unique validator pour aucune erreur d'errance de mongodb
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);