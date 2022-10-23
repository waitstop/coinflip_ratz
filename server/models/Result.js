const {Schema} = require("mongoose");
const mongoose = require("mongoose");


const schema = new Schema({
    address: String,
    result: String,
    bet: Number,
    f: Boolean
}, {timestamps: true})
const Result = mongoose.model('Result', schema, 'results')


module.exports = Result