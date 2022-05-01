const express = require('express')
const produitCtrl = require('../controllers/category.controller')
const router = express.Router()

router.post("/add-category", produitCtrl.addCategory)

module.exports = router