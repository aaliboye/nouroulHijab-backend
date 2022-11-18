const express = require('express');
const router = express.Router();
const produitCtrl = require('../controllers/produit.controller');
const auth = require('../middlewares/auth');


router.get('/list-produit',auth, produitCtrl.listProduits);
router.get('/list-produit/:idCategory', produitCtrl.listProduitsByCategory);


router.post('/add-produit', produitCtrl.addProduit);

router.post('/sell-product', produitCtrl.vendreProduit)


router.put('/add-stock/:idProduit', produitCtrl.addStock);


module.exports = router