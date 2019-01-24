const mongoose = require('mongoose')
const Schema = mongoose.Schema

var informationSchema = new Schema({
    name: String,
    link: String,
    phone: String,
    address: String
})

module.exports = mongoose.model('information', informationSchema)