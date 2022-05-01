const express = require('express');
const router = express.Router();
const produitCtrl = require('../controllers/produit.controller');

router.get('/list-produit', produitCtrl.listProduits);

router.post('/add-produit', produitCtrl.addProduit);

router.put('/add-stock/:idProduit', produitCtrl.addStock);


module.exports = router