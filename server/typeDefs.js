const {gql} = require('apollo-server-express');


const typeDefs = gql`
    type User {
        id: ID!
        address: String!
        balance: Float!
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
        createUser(address: String!, balance: Float!): User!
        setBalance(address: String!, amount: Float!, transaction: String!): Float!
        play(address: String!, bet: Float!): GameResult!
        withdraw(address: String!, amount: Float!): User!
    }
`;



module.exports = typeDefs