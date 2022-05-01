const mongoose = require('mongoose')

const produitSchema = mongoose.Schema({
    
    name: {type: String, required: true},
    description: {type: String, required: true},
    prixUnit: {type: Number, required: true},
    prixGros: {type: Number, required: true},
    stock: Number,
    vendus: {type: Number, default: 0},
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
})

module.exports = mongoose.model('Produit', produitSchema)
