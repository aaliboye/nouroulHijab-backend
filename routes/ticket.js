const express = require('express')
const router = express.Router()
const ticketCtrl = require('../controllers/ticket.controller')

router.get('/list-ventes', ticketCtrl.listVentes)
router.get('/list-ventes-today', ticketCtrl.listVenteToday)
router.put('/evaluation/:productName', ticketCtrl.hideVentes)
router.post('/valider-panier', ticketCtrl.validerPanier)
router.get('/:idVente', ticketCtrl.getVenteById)
router.post('/list-ventes-month', ticketCtrl.listVenteMonth)
router.get('/annulation/:idVente', ticketCtrl.annulerVente)

module.exports = router