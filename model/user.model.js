const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String},
    email: {type: String, required: true, unique: true},
    role : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    password: {type: String, required: false},
    telephone: {type: String, required: true},
    numeroCNI: {type: String, required: false},
    status: {type: String, required: true, default: 'desactive'}
})

module.exports = mongoose.model('User', userSchema)