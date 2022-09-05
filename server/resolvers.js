const User = require("./models/User");
const getResult = require("./api/result");
const {Keypair, Transaction, SystemProgram, PublicKey, sendAndConfirmTransaction, Connection, clusterApiUrl,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js')
const secretKeyFrom = require('./config')

const resolvers = {
    Query: {
        userByAddress: async (_, {address}) => {
            return User.findOne({address: address});
        }
    },
    Mutation: {
        createUser: async (_, {address, balance})=>{
            const newUser = new User({address, balance})
            await newUser.save()
            return newUser
        },
        setBalance: async (_, {address, amount}) => {
            const user = await User.findOne({address: address})
            if (!user){
                const newUser = new User({address, balance: Number((amount).toFixed(15))})
                await newUser.save()
                return Number((amount).toFixed(15))
            }
            const prevBalance = user.balance
            user.balance = Number((prevBalance+amount).toFixed(3))
            await user.save()
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
                user.balance = Number(prevBalance+(bet*2)).toFixed(3)
                result = 'win'
            }
            else{
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
                await sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [keypair]
                )
                user.balance = Number(user.balance-amount).toFixed(3)
                user.save()
                return user
            }
            catch (e) {
                console.log(e)
            }
        }
    }
}

module.exports = resolvers