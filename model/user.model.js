const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String},
    role : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    password: {type: String, required: true},
    telephone: {type: String, required: true},
    numeroCNI: {type: String, required: true}
})

module.exports = mongoose.model('User', userSchema)