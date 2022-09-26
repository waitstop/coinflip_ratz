const {gql} = require('apollo-server-express');


const typeDefs = gql`
    type User {
        id: ID!
        address: String!
        balance: Float!,
        gamePlayed: Int!,
        solGained: Float!,
        favSide: String!,
        leftSidePlayed: Int!,
        rightSidePlayed: Int!,
        winStreak: Int! 
    }
    type GameResult {
        address: String!,
        newBalance: Float!,
        result: String!
    }
    type Query {
        userByAddress(address: String!): User!
    }
    type Mutation {
        createUser(address: String!): User!
        setBalance(address: String!, amount: Float!, transaction: String!): Float!
        play(address: String!, bet: Float!, side: String!): GameResult!
        withdraw(address: String!, amount: Float!): User!
    }
`;



module.exports = typeDefs