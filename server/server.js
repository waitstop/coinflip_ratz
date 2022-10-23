const express = require('express')
const {ApolloServer} = require('apollo-server-express');
const cors = require('cors')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const mongoose = require("mongoose");
const cron = require("node-cron")
const generateFakeResults = require("./cron-tasks/fakeResults");


const startServer = async () => {
    const PORT = 5000
    const app = express()
    app.use(cors({
        origin: process.env.NODE_ENV !== 'production' ? undefined:'https://play.wildwestratz.xyz'
    }))

    await mongoose.connect('mongodb://127.0.0.1:27017/ratz_coinflip', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(()=>console.log('Mongoose connected'))

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        cache: 'bounded'
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({app})

    app.listen(PORT, ()=>{console.log(`Server started on port ${PORT}`)})

    /*cron.schedule('*!/10 * * * *', async ()=>{
        await generateFakeResults()
    })*/
}

startServer()