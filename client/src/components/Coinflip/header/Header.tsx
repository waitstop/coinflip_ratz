import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React, {useContext, useEffect} from "react";
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import Button from "../button/Button";
import Balance from "../balance/Balance";
import logoHub from '../../../images/logo_game_hub.png'
import logoGame from '../../../images/logo_back_to_hub.png'
import discordIcon from '../../../images/discord_icon.svg'
import twitterIcon from '../../../images/twitter_icon.svg'
import {CoinflipContext} from "../../../Context/CoinflipContext";
import {gql, useLazyQuery} from "@apollo/client";
import {useLocation} from "react-router-dom";

require("./header.css")

const GET_BALANCE = gql`
    query UserByAddress($address: String!) {
        userByAddress(address: $address) {
            balance
        }
    }
`

const Header = () => {
    const currentPath = useLocation().pathname
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
            {currentPath === '/' && (
                <a href={"/hub"}>
                    <img
                        className="logo"
                        src={logoGame}
                        alt="logo"
                    />
                </a>
            )}

            {currentPath === '/hub' && (
                <>
                    <div className={'header-social'}>
                        <a href="https://twitter.com/" target={"_blank"} rel={'noreferrer'}>
                            <img src={twitterIcon} alt="twitter"/>
                        </a>
                        <a href="https://discord.com/" target={"_blank"} rel={'noreferrer'}>
                            <img src={discordIcon} alt="discord"/>
                        </a>
                    </div>
                    <img
                        className="logo"
                        src={logoHub}
                        alt="logo"
                    />
                </>
            )}

            <div className="wallet-buttons-container">
                {
                    (!!publicKey && currentPath === '/') &&
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