const Result = require("../models/Result")
const getResult = require("../api/result")


function getRandomFloat(min, max, decimals=2) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function getRandomAddress (length = 44){
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

const generateFakeResults = async () => {
    const newResult =  await Result.create({address: getRandomAddress(), result: getResult(40) === 1 ? "win":"lose", bet: getRandomFloat(0.05, 3), f: true})
    await newResult.save()
}

module.exports = generateFakeResults