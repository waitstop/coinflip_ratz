const crypto = require('crypto')


const result = (chance=32) => {return (crypto.randomInt(0, 100) >= chance) ? 0 : 1}
module.exports = result

