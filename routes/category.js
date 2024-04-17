const express = require('express')
const categoryCtrl = require('../controllers/category.controller')
const auth = require('../middlewares/auth')
const router = express.Router()

router.post("/add-category", categoryCtrl.addCategory)

router.get('/list-categories', auth, categoryCtrl.listCategory)

module.exports = router