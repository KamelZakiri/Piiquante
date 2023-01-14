const multer = require('multer');
// multer est un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP

const MIME_TYPES = {
//constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
//la fonction filename indique à multer d'utiliser le nom d'origine
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');