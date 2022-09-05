const {Schema} = require("mongoose");
const mongoose = require("mongoose");


const schema = new Schema({
    address: String,
    balance: Number
})
const User = mongoose.model('User', schema, 'users')


module.exports = User