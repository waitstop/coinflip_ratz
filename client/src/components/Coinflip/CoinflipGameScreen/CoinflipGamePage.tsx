import React, {FC, useEffect, useState} from "react";
import Header from "../header/Header";
import {Rat, RATS} from "./Rat";
import Button from "../button/Button";
import CoinflipMenu from "./CoinflipMenu/CoinflipMenu";
import {CoinflipContext} from "../../../Context/CoinflipContext";
import {useMutation} from "@apollo/client";
import {useWallet} from "@solana/wallet-adapter-react";
import animationLeftWins from "../../../images/animations/left_wins_black.gif"
import animationRightWins from "../../../images/animations/right_wins_black.gif"
import animationInit from '../../../images/animations/duel_static.png'
import loader from '../../../images/loader.png'
import { motion } from "framer-motion";
import Box from "../box/Box";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import './toast.css'
import {GET_BALANCE, GET_GAME_HISTORY, GET_USER_STATS, PLAY_QUERY} from '../Querys'
import CoinflipPlays from "./CoinflipPlays/CoinflipPlays";


require('./coinflipPage.css')

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}





const loadImage = (url: string) => new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img.src))
    img.addEventListener('error', (err) => reject(err))
    img.src = url
})

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

    const [animationsUrl, setAnimationUrl] = useState<{left: string, right: string}>({
        left: animationLeftWins,
        right: animationRightWins
    })

    const [playQuery] = useMutation(PLAY_QUERY, {
        refetchQueries: [
            {query: GET_BALANCE, variables: {address: publicKey}},
            {query: GET_USER_STATS, variables: {address: publicKey}},
            {query: GET_GAME_HISTORY, variables: {limit: 5}}
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
        setAnimationUrl({
            ...animationsUrl,
            left: animationInit,
            right: animationInit
        })
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
    }

    const handleReady = async () => {
        if(!(currentBet && currentRat)) return
        if(!(currentBet <= 5 && currentBet >= 0.01)) return
        toast.info('Game starting...')
        setIsMenu(false)
        setGameState('loading')
        const imgs = await Promise.all([
            loadImage(animationRightWins+'?clear='+Math.random()),
            loadImage(animationLeftWins+'?clear='+Math.random())
        ])
        setAnimationUrl({
            left: imgs[1],
            right: imgs[0]
        })

        playQuery({variables: {address: publicKey, bet: currentBet, side: currentRat}})
            .then((res)=>{
                setGameState('run')
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
            <ToastContainer
                className={'custom-toast-container'}
                toastClassName={'custom-toast'}
                bodyClassName={'custom-toast-body'}
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
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
                                            backgroundColor: "#363636",
                                            backgroundImage: `url(${animationInit})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                )
                            }
                            {(gameState === 'loading' && !isMenu) && (
                                <div
                                    style={{
                                        backgroundColor: "#B3DBF3",
                                        width: "100%",
                                        height: "100%",
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                    }}
                                >
                                    <motion.img
                                        animate={{rotate: 360}}
                                        transition={{ repeat: Infinity, repeatDelay: 0.3 , type: "spring"}}
                                        style={{
                                            width: "200px"
                                        }}
                                        src={loader}
                                    />
                                </div>
                            )}
                            {(gameState !== 'init' && !isMenu && gameState !== 'loading') && (
                                <div
                                    style={{
                                        backgroundColor: "#363636",
                                        backgroundImage: `url(${winSide === 'left' ? animationsUrl.left:animationsUrl.right}`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'contain',
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
                        className={"select-btn"}
                        disabled={gameState !== 'init' || !publicKey}
                        onClick={()=>setCurrentRat('left')}
                        style={{
                            backgroundColor: currentRat === 'left' ? '#6D6D6D':'#999999',
                            border: currentRat === 'left' ? '0.1em outset #999999':'0.1em outset #BFBFBF'
                        }}
                    >
                        {currentRat === 'left'?'Selected':'Select'}
                    </Button>
                    <div className={'bet-amount-container'}>
                        <span className={"bet-description"}>Place a bet: </span>
                        <span className={"bet-description-min"}>Bet: </span>
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
                        className={'ready-btn'}
                        disabled={gameState !== 'init' || !currentRat || !publicKey}
                        onClick={handleReady}
                    >
                        Ready
                    </Button>
                    <Button
                        className={"select-btn"}
                        disabled={gameState !== 'init' || !publicKey}
                        onClick={()=>setCurrentRat('right')}
                        style={{
                            backgroundColor: currentRat === 'right' ? '#6D6D6D':'#999999',
                            border: currentRat === 'right' ? '0.1em outset #999999':'0.1em outset #BFBFBF'
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

                <div className={'row plays'}>
                    <CoinflipPlays/>
                </div>
            </div>
        </CoinflipContext.Provider>
    )
}


export default CoinflipGamePage