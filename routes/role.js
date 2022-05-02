const express = require('express');
const router = express.Router();
const roleCtrl = require('../controllers/role.controller')

router.post('/add-role', roleCtrl.addRole);

router.get('/list-roles', roleCtrl.listRoles);


module.exports = router