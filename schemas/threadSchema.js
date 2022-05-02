const mongoose = require("mongoose")

const Schema = mongoose.Schema

const threadSchema = new Schema({
    user: {
        type: Object,
        required: true
    },
    comments: {
        type: Array,
        required: true
    },

    name: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('threadSchema', threadSchema)