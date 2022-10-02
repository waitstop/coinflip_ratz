import {gql} from "@apollo/client";

export const GET_BALANCE = gql`
    query UserByAddress($address: String!) {
        userByAddress(address: $address) {
            balance
        }
    }
`

export const PLAY_QUERY = gql`
    mutation Play($address: String!, $bet: Float!, $side: String!) {
        play(address: $address, bet: $bet, side: $side) {
            newBalance,
            result
        }
    }
`

export const SET_BALANCE = gql`
    mutation SetBalance($address: String!, $amount: Float!, $transaction: String!) {
        setBalance(address: $address, amount: $amount, transaction: $transaction)
    }
`

export const WITHDRAW = gql`
    mutation Withdraw($address: String!, $amount: Float!) {
        withdraw(address: $address, amount: $amount) {
            newBalance:balance
        }
    }
`

export const GET_USER_STATS = gql`
    query UserByAddress($address: String!) {
        userStats:userByAddress(address: $address) {
            gamePlayed
            solGained
            favSide
            bestWinStreak
        }
    }
`