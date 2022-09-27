const secretKeyFrom = Uint8Array.from([196,199,30,28,40,108,36,69,38,37,39,100,83,170,44,238,166,42,171,50,85,104,114,168,185,176,65,13,10,70,150,177,147,138,212,67,33,179,86,73,33,167,241,198,223,103,114,104,175,147,65,91,186,100,247,232,66,212,149,214,5,131,47,246])

let network;
if(process.env.NODE_ENV === 'development') network = 'devnet'
if(process.env.NODE_ENV === 'production') network = 'mainnet-beta'


module.exports = {secretKeyFrom, network}