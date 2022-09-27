const User = require("./models/User");
const getResult = require("./api/result");
const {Keypair, Transaction, SystemProgram, PublicKey, sendAndConfirmTransaction, Connection, clusterApiUrl,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js')
const {secretKeyFrom, network} = require('./config')
const logger = require('./api/logger')



const fixFloat = 4

const resolvers = {
    Query: {
        userByAddress: async (_, {address}) => {
            const user = await User.findOne({address: address})
            if(!!user) return user
            const newUser = new User({address: address})
            await newUser.save()
            return newUser
        }
    },
    Mutation: {
        createUser: async (_, {address})=>{
            const newUser = new User({address})
            await newUser.save()
            return newUser
        },
        setBalance: async (_, {address, amount, transaction}) => {
            const connection = await new Connection(clusterApiUrl(network))
            const transactionStatus = await connection.getTransaction(transaction, {commitment: "confirmed"})

            if(!!transactionStatus.meta.err) {
                logger.error(`${address} SET BALANCE => ${amount} | signature: ${transaction} (ERROR TRANSACTION)`)
                return
            }

            const user = await User.findOne({address: address})
            if (!user){
                const newUser = new User({address, balance: Number((amount).toFixed(fixFloat))})
                await newUser.save()
                return Number((amount).toFixed(fixFloat))
            }
            const prevBalance = user.balance
            user.balance = Number((prevBalance+amount).toFixed(3))
            await user.save()
            logger.info(`${address} SET BALANCE => ${amount} | signature: ${transaction} (SUCCESS)`)
            return user.balance
        },
        play: async (_, {address, bet, side}) => {
            const user = await User.findOne({address: address})
            if(!user) return
            if(user.balance < bet) return
            if(!(bet >= 0.01 && bet <= 5)) return

            let randSide = getResult()
            let result
            const prevBalance = user.balance
            if(randSide === 1){
                logger.info(`${address} PLAY FOR ${bet} | result: WIN (SUCCESS)`)
                user.balance = Number(prevBalance+(bet*2-(bet/100 * 3))).toFixed(fixFloat) // bet * 2 - 3%
                result = 'win'

                //stats
                user.solGained = Number(bet*2 + user.solGained).toFixed(fixFloat)
                user.winStreak += 1
            }
            else{
                logger.info(`${address} PLAY FOR ${bet} | result: LOSE (SUCCESS)`)
                user.balance = Number(prevBalance-bet).toFixed(fixFloat)
                result = 'lose'

                //stats
                user.winStreak = 0
            }

            //stats
            user.gamePlayed += 1
            side === 'left' ? user.leftSidePlayed += 1 : user.rightSidePlayed += 1
            user.leftSidePlayed > user.rightSidePlayed ? user.favSide = 'left' : user.favSide = 'right'

            await user.save()
            return ({address: address, newBalance: user.balance, result: result})
        },
        withdraw: async (_, {address, amount}) => {
            const user = await User.findOne({address: address})
            if(!user) return
            if(user.balance < amount) return

            const keypair = await Keypair.fromSecretKey(secretKeyFrom)
            const transaction = await new Transaction()
            const connection = await new Connection(clusterApiUrl(network))

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: new PublicKey(address),
                    lamports: LAMPORTS_PER_SOL*amount
                })
            )
            try {
                user.balance = Number(user.balance-amount).toFixed(fixFloat)
                user.save()
                sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [keypair]
                )
                logger.info(`${address} WITHDRAW ${amount} (SUCCESS)`)
                return user
            }
            catch (e) {
                logger.info(`${address} WITHDRAW ${amount} (ERROR) | ERROR MESSAGE: ${e}`)
                console.log(e)
            }
        }
    }
}

module.exports = resolvers