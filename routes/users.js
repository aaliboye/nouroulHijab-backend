var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/user.controller')

/* GET users listing. */
router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.logIn)

router.post('/add-user', userCtrl.addUser);
router.post('/set-password/:idUser', userCtrl.setPassword);

router.get('/role-user', userCtrl.getUserRole);
router.get('/list-users', userCtrl.listUser);

module.exports = router;
