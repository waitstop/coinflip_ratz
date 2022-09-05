import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React, {useContext, useEffect} from "react";
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import Button from "./Button";
import Balance from "./Balance";
import logo from '../images/logo_header.png'
import {CoinflipContext} from "../Context/CoinflipContext";
import {gql, useLazyQuery} from "@apollo/client";

require("./css/header.css")

const GET_BALANCE = gql`
    query UserByAddress($address: String!) {
        userByAddress(address: $address) {
            balance
        }
    }
`

const Header = () => {
    const Context = useContext(CoinflipContext)
    const isMenu = Context.isMenu
    const setIsMenu = Context.setIsMenu
    const balance = Context.balance
    const setBalance = Context.setBalance
    const {publicKey} = useWallet()
    const {connection} = useConnection()
    const [getBalance] = useLazyQuery(GET_BALANCE)

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

    return (
        <div className="header">
            <img className="logo" src={logo} alt="logo"/>
            <div className="wallet-buttons-container">
                {
                    !!publicKey &&
                    <>
                        <Balance balance={balance || 0}/>

                        <Button onClick={()=> {
                            if(!setIsMenu) return
                            setIsMenu(!isMenu)
                        }}>deposit</Button>
                    </>
                }
                <WalletMultiButton className={"custom-wallet-button"}/>
            </div>
        </div>
    )
}


export default Header