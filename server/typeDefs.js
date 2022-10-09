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
        winStreak: Int!,
        bestWinStreak: Int!
    }
    type GameResult {
        address: String!,
        newBalance: Float!,
        result: String!
    }
    type Result {
        address: String!,
        result: String!,
        date: String!,
        bet: Float!
    }
    type Query {
        userByAddress(address: String!): User!,
        getAllResults(limit: Int!):[Result!]!,
    }
    type Mutation {
        setBalance(address: String!, amount: Float!, transaction: String!): Float!
        play(address: String!, bet: Float!, side: String!): GameResult!
        withdraw(address: String!, amount: Float!): User!
    }
`;



module.exports = typeDefs