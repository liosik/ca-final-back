const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    picture:{
        type: String,
        required: true
    },
})


module.exports = mongoose.model('userSchema', userSchema)