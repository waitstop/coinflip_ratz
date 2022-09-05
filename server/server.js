const express = require('express')
const {ApolloServer} = require('apollo-server-express');
const cors = require('cors')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const mongoose = require("mongoose");


const startServer = async () => {
    const PORT = 5000
    const app = express()
    app.use(cors())
    //app.get('/result', (req, res)=>getResult(req, res))
    await mongoose.connect('mongodb://127.0.0.1:27017/ratz_coinflip', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(()=>console.log('Mongoose connected'))
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({app})
    app.listen(PORT, ()=>{console.log(`Server started on port ${PORT}`)})
}

startServer()