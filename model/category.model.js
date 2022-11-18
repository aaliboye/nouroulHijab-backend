const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model('Category', categorySchema)
