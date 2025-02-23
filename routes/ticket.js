const express = require('express')
const router = express.Router()
const ticketCtrl = require('../controllers/ticket.controller')
const auth = require('../middlewares/auth')

router.get('/list-ventes', auth, ticketCtrl.listVentes)
router.post('/list-ventes-date',auth,  ticketCtrl.listVentebyDate)
router.get('/list-ventes-today',auth,  ticketCtrl.listVenteToday)
router.put('/evaluation/:productName',auth,  ticketCtrl.hideVentes)
router.post('/valider-panier',auth,  ticketCtrl.validerPanier)
router.get('/:idVente',auth,  ticketCtrl.getVenteById)
router.post('/list-ventes-month',auth,  ticketCtrl.listVenteMonth)
router.get('/annulation/:idVente',auth,  ticketCtrl.annulerVente)

module.exports = router