import {useCallback, useContext, useEffect, useState} from "react";
import {LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {PUBLIC_ADDRESS_OWNER} from "../config";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {CoinflipContext} from "../Context/CoinflipContext";
import Button from "./Button";

require('./css/coinflipMenu.css')

const GET_BALANCE = gql`
    query UserByAddress($address: String!) {
        userByAddress(address: $address) {
            balance
        }
    }
`

const SET_BALANCE = gql`
    mutation SetBalance($address: String!, $amount: Float!) {
        setBalance(address: $address, amount: $amount)
    }
`

const WITHDRAW = gql`
    mutation Withdraw($address: String!, $amount: Float!) {
        withdraw(address: $address, amount: $amount) {
            newBalance:balance
        }
    }
`

const DepositMenu = () => {
    const Context = useContext(CoinflipContext)
    const {publicKey, sendTransaction} = useWallet()
    const {connection} = useConnection()
    const balance = Context.balance
    const setBalance = Context.setBalance

    const [currentDeposit, setCurrentDeposit] = useState<number|null>()
    const [currentWithdraw, setCurrentWithdraw] = useState<number|null>()

    const [getBalance] = useLazyQuery(GET_BALANCE)
    const [setBdBalance] = useMutation(SET_BALANCE, {
        refetchQueries: [
            {query: GET_BALANCE, variables: {address: publicKey}},
            'UserByAddress'
        ]
    })
    const [withdraw] = useMutation(WITHDRAW, {
        refetchQueries: [
            {query: GET_BALANCE, variables: {address: publicKey}},
            'UserByAddress'
        ]
    })

    useEffect(() => {
        if (!publicKey) {
            if(!setBalance) return
            setBalance(0)
            return
        }
        getBalance({variables: {address: publicKey}}).then(res => {
            if(!setBalance) return
            setBalance(res.data.userByAddress.balance)
        })
    }, [publicKey, connection, getBalance, setBalance])

    const deposit = useCallback(async (amount: number) => {
        if(amount < 0.05) return
        if (!publicKey) return

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(PUBLIC_ADDRESS_OWNER),
                lamports: LAMPORTS_PER_SOL * amount
            })
        )

        const {
            context: {slot: minContextSlot},
            value: {blockhash, lastValidBlockHeight}
        } = await connection.getLatestBlockhashAndContext()

        try {
            const signature = await sendTransaction(transaction, connection, {minContextSlot})
            await connection.confirmTransaction({blockhash, lastValidBlockHeight, signature})

            setBdBalance({variables: {address: publicKey, amount: amount}}).then((data) => {
                if(!setBalance) return
                setBalance(data.data.setBalance)
            })
        } catch (e) {
            // HANDLE ERROR
        }
    }, [publicKey, sendTransaction, connection, setBdBalance, setBalance])

    const handleWithdraw = () => {
        if(!(currentWithdraw && balance)) return
        if(currentWithdraw > balance) return
        withdraw({variables: {address: publicKey, amount: currentWithdraw}}).then((res)=>{
            if(!setBalance) return
            setBalance(res.data.withdraw.newBalance)
        })
    }

    return(
        <div className={'deposit-menu'}>
            <h2 style={{marginTop: '0'}}>deposit solana</h2>
            <div className={'buttons-container'}>
                <div className="input-wrapper">
                    <input
                        value={currentDeposit || undefined}
                        onChange={(e)=>setCurrentDeposit(parseFloat(e.target.value))}
                        placeholder="min deposit: 0.05 sol"
                        type="number"
                    />
                </div>
                <Button onClick={()=> {
                    if(!currentDeposit) return
                    deposit(currentDeposit)
                }}>add funds</Button>
            </div>

            <h2>withdraw solana</h2>
            <div className={'buttons-container'}>
                <div className="input-wrapper">
                    <input
                        value={currentWithdraw||undefined}
                        onChange={(e)=>setCurrentWithdraw(parseFloat(e.target.value))}
                        placeholder="withdraw amount"
                        type="number"/>
                </div>
                <Button onClick={handleWithdraw}>withdraw</Button>
            </div>

            <span>available for withdrawal: {balance} sol</span>
        </div>
    )
}

export default DepositMenu