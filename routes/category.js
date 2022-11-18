const express = require('express')
const categoryCtrl = require('../controllers/category.controller')
const router = express.Router()

router.post("/add-category", categoryCtrl.addCategory)

router.get('/list-categories', categoryCtrl.listCategory)

module.exports = router