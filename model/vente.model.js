const mongoose = require('mongoose')

const venteSchema = mongoose.Schema({
    listProduits:{type: Array, required: true},
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    prixTotal: {type: Number, required: true},
    status:{type: String, required: false},
    modePaiement:{type: String, required: false},
    nomClient:{type: String, required: false},
    numeroClient:{type: String, required: false},
    prixPaye:{type: Number, required: false},
    moyenPaiement:{type: String, required: false},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, required: false}

})

module.exports = mongoose.model('Vente', venteSchema)