const User = require("./models/User");
const getResult = require("./api/result");
const {Keypair, Transaction, SystemProgram, PublicKey, sendAndConfirmTransaction, Connection, clusterApiUrl,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js')
const secretKeyFrom = require('./config')
const logger = require('./api/logger')

const resolvers = {
    Query: {
        userByAddress: async (_, {address}) => {
            const user = await User.findOne({address: address})
            if(!!user) return user
            const newUser = new User({address: address, balance: 0})
            await newUser.save()
            return newUser
        }
    },
    Mutation: {
        createUser: async (_, {address, balance})=>{
            const newUser = new User({address, balance})
            await newUser.save()
            return newUser
        },
        setBalance: async (_, {address, amount, transaction}) => {
            const connection = await new Connection(clusterApiUrl('devnet'))
            const transactionStatus = await connection.getTransaction(transaction, {commitment: "confirmed"})

            if(!!transactionStatus.meta.err) {
                logger.error(`${address} SET BALANCE => ${amount} | signature: ${transaction} (ERROR TRANSACTION)`)
                return
            }

            const user = await User.findOne({address: address})
            if (!user){
                const newUser = new User({address, balance: Number((amount).toFixed(15))})
                await newUser.save()
                return Number((amount).toFixed(15))
            }
            const prevBalance = user.balance
            user.balance = Number((prevBalance+amount).toFixed(3))
            await user.save()
            logger.info(`${address} SET BALANCE => ${amount} | signature: ${transaction} (SUCCESS)`)
            return user.balance
        },
        play: async (_, {address, bet}) => {
            const user = await User.findOne({address: address})
            if(!user) return
            if(user.balance < bet) return
            if(!(bet >= 0.01 && bet <= 5)) return

            let randSide = getResult()
            let result
            const prevBalance = user.balance
            if(randSide === 1){
                logger.info(`${address} PLAY FOR ${bet} | result: WIN (SUCCESS)`)
                user.balance = Number(prevBalance+(bet*2)).toFixed(3)
                result = 'win'
            }
            else{
                logger.info(`${address} PLAY FOR ${bet} | result: LOSE (SUCCESS)`)
                user.balance = Number(prevBalance-bet).toFixed(3)
                result = 'lose'
            }
            await user.save()
            return ({address: address, newBalance: user.balance, result: result})
        },
        withdraw: async (_, {address, amount}) => {
            const user = await User.findOne({address: address})
            if(!user) return
            if(user.balance < amount) return

            const keypair = await Keypair.fromSecretKey(secretKeyFrom)
            const transaction = await new Transaction()
            const connection = await new Connection(clusterApiUrl('devnet'))

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: new PublicKey(address),
                    lamports: LAMPORTS_PER_SOL*amount
                })
            )
            try {
                user.balance = Number(user.balance-amount).toFixed(3)
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