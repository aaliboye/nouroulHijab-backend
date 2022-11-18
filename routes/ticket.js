const express = require('express')
const router = express.Router()
const ticketCtrl = require('../controllers/ticket.controller')

router.get('/list-ventes', ticketCtrl.listVentes)
router.get('/list-ventes-today', ticketCtrl.listVenteToday)
router.put('/evaluation/:productName', ticketCtrl.hideVentes)

module.exports = router