import React, {FC, useEffect, useState} from "react";
import Header from "../header/Header";
import {Rat, RATS} from "./Rat";
import Button from "../button/Button";
import CoinflipMenu from "./CoinflipMenu/CoinflipMenu";
import {CoinflipContext} from "../../../Context/CoinflipContext";
import {gql, useMutation} from "@apollo/client";
import {useWallet} from "@solana/wallet-adapter-react";
import animationLeftWins from "../../../images/animations/left_wins_black.gif"
import animationRightWins from "../../../images/animations/right_wins_black.gif"
import animationInit from '../../../images/animations/duel_static.png'
import { motion } from "framer-motion";
import Box from "../box/Box";


require('./coinflipPage.css')

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const GET_BALANCE = gql`
    query UserByAddress($address: String!) {
        userByAddress(address: $address) {
            balance
        }
    }
`

const PLAY_QUERY = gql`
    mutation Play($address: String!, $bet: Float!) {
        play(address: $address, bet: $bet) {
            newBalance,
            result
        }
    }
`


const CoinflipGamePage: FC = () => {
    const [isMenu, setIsMenu] = useState<boolean>(false)
    const [balance, setBalance] = useState<number>(0)
    const {publicKey} = useWallet()

    const [ratsIds, setRatIds] = useState([0,1])
    const [currentBet, setCurrentBet] = useState<number|null>(0.01)
    const [currentRat, setCurrentRat] = useState('')
    const [leftRatState, setLeftRatState] = useState<string>('normal')
    const [rightRatState, setRightRatState] = useState<string>('normal')
    const [winSide, setWinSide] = useState<string|null>(null)
    const [gameState, setGameState] = useState<string>('init')
    const [imgRandValue, setImgRandValue] = useState<number>(Math.random())

    const [playQuery] = useMutation(PLAY_QUERY, {
        refetchQueries: [
            {query: GET_BALANCE, variables: {address: publicKey}},
            'UserByAddress'
        ]
    })

    useEffect(()=>{
        let id1 = getRandomIntInclusive(0, RATS.length-1)
        let id2 = getRandomIntInclusive(0, RATS.length-1)
        while (id1 === id2){
            id2 = getRandomIntInclusive(0, RATS.length-1)
        }
        setRatIds([id1, id2])
    }, [])

    const handleReset = () => {
        setGameState('init')
        setLeftRatState('normal')
        setRightRatState('normal')
        setWinSide(null)
        setCurrentRat('')
        let id1 = getRandomIntInclusive(0, RATS.length-1)
        let id2 = getRandomIntInclusive(0, RATS.length-1)
        while (id1 === id2){
            id2 = getRandomIntInclusive(0, RATS.length-1)
        }
        setRatIds([id1, id2])
        setImgRandValue(Math.random())
    }

    const handleReady = () => {
        setGameState('run')
        if(!(currentBet && currentRat)) return
        if(!(currentBet <= 5 && currentBet >= 0.01)) return

        playQuery({variables: {address: publicKey, bet: currentBet}})
            .then((res)=>{
                setTimeout(()=>{
                    setBalance(res.data.play.newBalance)
                },3000)
                if(res.data.play.result === 'win'){
                    setWinSide(currentRat)
                    setTimeout(()=>{
                        if(currentRat === 'left') {
                            setRightRatState('dead')
                            setLeftRatState('win')
                        }
                        else{
                            setRightRatState('win')
                            setLeftRatState('dead')
                        }
                    },3000)

                }
                else {
                    setWinSide(currentRat === 'left' ? 'right':'left')
                    setTimeout(()=>{
                        if(currentRat === 'right') {
                            setRightRatState('dead')
                            setLeftRatState('win')
                        }
                        else{
                            setRightRatState('win')
                            setLeftRatState('dead')
                        }
                    },3000)

                }
            })

        setTimeout(()=>{
            setGameState('reset')
        }, 5000)
    }

    return(
        <CoinflipContext.Provider value={{isMenu, setIsMenu, balance, setBalance}}>
            <Header/>
            <div className="coinflip-layout">
                <div className="row">
                    <Rat id={ratsIds[0]} status={leftRatState} orientation='left'/>
                    <Box>
                            {!!isMenu &&(
                                <CoinflipMenu/>
                            )}
                            {
                                (gameState === 'init' && !isMenu) && (
                                    <div
                                        style={{
                                            backgroundImage: `url(${animationInit})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                )
                            }
                            {(gameState !== 'init' && !isMenu) && (
                                <div
                                    style={{
                                        backgroundImage: `url(${winSide === 'left' ? animationLeftWins:animationRightWins}?dummy=${imgRandValue})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    {(gameState === 'reset' && !isMenu) && (
                                        <motion.div
                                            className={"reset-screen-wrapper"}
                                            initial={{
                                                opacity: 0
                                            }}
                                            animate={{
                                                opacity: 1
                                            }}
                                            style={{
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                                height: '100%',
                                                position: 'relative'
                                            }}
                                        >
                                            {winSide === currentRat ?
                                                (
                                                    <div>
                                                        <h1>
                                                            CONGRATZ!
                                                            <br/>
                                                            YOU WON THIS TIME!
                                                        </h1>
                                                        <h2>
                                                            your bet has doubled, but someone got hurt...
                                                        </h2>
                                                    </div>
                                                ):(
                                                    <div>
                                                        <h1>
                                                            Huh, you lost, partner.
                                                            <br/>
                                                            Better luck next time...
                                                        </h1>
                                                        <h2>
                                                            Be careful trying to play out.
                                                        </h2>
                                                    </div>
                                                )
                                            }
                                            <Button
                                                style={{
                                                    fontSize: '3rem',
                                                    color: 'white',
                                                    position: 'absolute',
                                                    bottom: '3.5rem',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)'
                                                }}
                                                onClick={handleReset}
                                            >
                                                reset
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                    </Box>
                    <Rat id={ratsIds[1]} status={rightRatState} orientation='right'/>
                </div>

                <div className="row">
                    <Button
                        disabled={gameState !== 'init'}
                        onClick={()=>setCurrentRat('left')}
                        style={{
                            backgroundColor: currentRat === 'left' ? '#6D6D6D':'#999999',
                            border: currentRat === 'left' ? '0.1em outset #999999':'0.1em outset #BFBFBF',
                            width: '320px', padding: '1rem 0', fontSize: '3rem'
                        }}
                    >
                        {currentRat === 'left'?'Selected':'Select'}
                    </Button>
                    <div className={'bet-amount-container'}>
                        <span>Place a bet: </span>
                        <div className={'bet-input-wrapper'}>
                            <div className="bet-min-max-buttons">
                                <button onClick={()=>setCurrentBet(0.01)}>min</button>
                                <button onClick={()=>setCurrentBet(5)}>max</button>
                            </div>
                            <div className={'bet-input-container'}>
                                <input value={currentBet||undefined} onChange={e=>setCurrentBet(parseFloat(e.target.value))} max={5} min={0.01} type="number"/>
                                <span> sol</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        disabled={gameState !== 'init' || !currentRat}
                        style={{width: '250px', padding: '1rem 0', fontSize: '3rem'}}
                        onClick={handleReady}
                    >
                        Ready
                    </Button>
                    <Button
                        disabled={gameState !== 'init'}
                        onClick={()=>setCurrentRat('right')}
                        style={{
                            backgroundColor: currentRat === 'right' ? '#6D6D6D':'#999999',
                            border: currentRat === 'right' ? '0.1em outset #999999':'0.1em outset #BFBFBF',
                            width: '320px', padding: '1rem 0', fontSize: '3rem'
                        }}
                    >
                        {currentRat === 'right'?'Selected':'Select'}
                    </Button>
                </div>

                <div className="row description">
                    <span>Select a rat you would like to bet on by pressing <strong>select</strong> buttons on the sides</span>
                    <span>Put amount of sol you would like to bet in the field <strong>(0.01 sol min. - 5  sol max.)</strong></span>
                    <span><strong>Press ready</strong> and test your luck watching fellow ratz injuring each other because of your greed </span>
                </div>
            </div>
        </CoinflipContext.Provider>
    )
}


export default CoinflipGamePage