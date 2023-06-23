const mongoose = require('mongoose');


const ticketSchema = mongoose.Schema({
    productName: {type: String, required: true},
    quantite: {type: Number, required: true},
    type: {type: String, required: false},
    prixTotal: {type: Number, required: true},
    userName: {type: String},
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    categoryName: {type: String},
    visible :  {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now()},
    evaluatedAt: {type: Date},
    status:{type: String, required: true}
})

module.exports = mongoose.model('Ticket', ticketSchema)