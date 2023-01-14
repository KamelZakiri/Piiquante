// Il récupere l'ensemble des routes du sites

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauce = require('../models/sauce');

const sauceCtrl = require('../controllers/sauce')

// on permet de créer un produit grace a cette ligne
router.post('/', auth, multer, sauceCtrl.createSauce);
  
//Modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
  
//Suppression d'une sauce
//Permet de supprimer une sauce tjrs avec l'aide de l'id
router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
// Récupération d'une sauce spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Récupération de tout les sauces
router.get('/', auth, sauceCtrl.allSauce);

// Liker les sauces ou pas
router.post('/:id/like', auth, sauceCtrl.likes);

module.exports = router;