const mongoose = require('mongoose')

const venteSchema = mongoose.Schema({
    listProduits:{type: Array, required: true},
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    prixTotal: {type: Number, required: true},
    status:{type: String, required: false},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, required: false}

})

module.exports = mongoose.model('Vente', venteSchema)