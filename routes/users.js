var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/user.controller')

/* GET users listing. */
router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.logIn)

module.exports = router;
