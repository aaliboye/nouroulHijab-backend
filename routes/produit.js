const express = require('express');
const router = express.Router();
const produitCtrl = require('../controllers/produit.controller');
const auth = require('../middlewares/auth');
const ticketController = require('../controllers/ticket.controller');
// const upload = require('../middlewares/multer-config');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
      console.log('imageee');
      // Générez un nom de fichier unique en ajoutant un timestamp au nom d'origine
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      console.log(file);
      // cb(null, file.fieldname +'.mp3');
      cb(null, file.fieldname+ uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  

// Créez un middleware multer en utilisant la configuration spécifiée
const upload = multer({ storage: storage });



router.get('/list-produit',auth, produitCtrl.listProduits);
router.get('/list-produit/:idCategory', auth, produitCtrl.listProduitsByCategory);



// router.post('/add-produit',  produitCtrl.addProduit);
router.post('/add-produit', auth, upload.single('image'), produitCtrl.addProduit);
router.post('/sell-product', produitCtrl.vendreProduit)



router.post('/add-stock/:idProduit', produitCtrl.addStock);


module.exports = router