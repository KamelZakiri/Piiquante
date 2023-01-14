// Le middleware me permet de recevoir les objets et de les manipuler
// Grace a next je peut passer au middleware suivant 

// me permet de naviguer entre les deux ports 3000 et 4200 COR
const cors = require('cors')
const express = require('express');
const app = express();
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path')
const helmet = require('helmet')


app.use(express.json());

app.use(helmet())

/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});*/

app.use(cors()); // Use CORS and allowed sharing the API

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')))

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Kamel26:Marrakech42100!@cluster0.kkzacgl.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;
