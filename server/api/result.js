const crypto = require('crypto')

const result = () => {
    const CHANCE_TO_WIN = 25
    let result = (crypto.randomInt(0, 100)>=CHANCE_TO_WIN)?0:1
    return result
}

module.exports = result

