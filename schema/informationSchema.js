const mongoose = require('mongoose')
const Schema = mongoose.Schema

var informationSchema = new Schema({
    name: String,
    link: String,
    phone: String,
    address: String,
    open_today: String,
    open_tomorrow: String
})

module.exports = mongoose.model('information', informationSchema)