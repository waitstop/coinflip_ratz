const {Schema} = require("mongoose");
const mongoose = require("mongoose");


const schema = new Schema({
    address: String,
    balance: {type: Number, default: 0},
    gamePlayed: {type: Number, default: 0},
    solGained: {type: Number, default: 0},
    favSide: {type: String, default: 'N/A'},
    leftSidePlayed: {type: Number, default: 0},
    rightSidePlayed: {type: Number, default: 0},
    winStreak: {type: Number, default: 0}
})
const User = mongoose.model('User', schema, 'users')


module.exports = User