import React, {FC, useEffect, useState} from "react";
import Header from "./Header";
import {Rat, RATS} from "./Rat";
import Button from "./Button";
import CoinflipMenu from "./CoinflipMenu";
import {CoinflipContext} from "../Context/CoinflipContext";
import {gql, useMutation} from "@apollo/client";
import {useWallet} from "@solana/wallet-adapter-react";

require('./css/coinflipPage.css')

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

const CoinflipPage: FC = () => {
    const [isMenu, setIsMenu] = useState<boolean>(false)
    const [balance, setBalance] = useState<number>(0)
    const {publicKey} = useWallet()

    const [ratsIds, setRatIds] = useState([0,1])
    const [currentBet, setCurrentBet] = useState(0.01)
    const [currentRat, setCurrentRat] = useState('')
    const [leftRatState, setLeftRatState] = useState<string>('normal')
    const [rightRatState, setRightRatState] = useState<string>('normal')
    const [winSide, setWinSide] = useState<string|null>(null)

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

    const handleReady = () => {
        if(!(currentBet && currentRat)) return
        if(!(currentBet <= 5 && currentBet >= 0.01)) return

        playQuery({variables: {address: publicKey, bet: currentBet}})
            .then((res)=>{
                setBalance(res.data.play.newBalance)
                if(res.data.play.result === 'win'){
                    setWinSide(currentRat)
                    if(currentRat === 'left') {
                        setRightRatState('dead')
                        setLeftRatState('win')
                    }
                    else{
                        setRightRatState('win')
                        setLeftRatState('dead')
                    }
                }
                else {
                    if(currentRat === 'right') {
                        setRightRatState('dead')
                        setLeftRatState('win')
                    }
                    else{
                        setRightRatState('win')
                        setLeftRatState('dead')
                    }
                }
            })

        setTimeout(()=>{
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
        }, 2000)
    }

    return(
        <CoinflipContext.Provider value={{isMenu, setIsMenu, balance, setBalance}}>
            <Header/>
            <div className="coinflip-layout">
                <div className="row">
                    <Rat id={ratsIds[0]} status={leftRatState} orientation='left'/>
                    <div className="screen-container">
                        <div className="screen">
                            {!!isMenu &&(
                                <CoinflipMenu/>
                            )}
                            {!isMenu && (
                                <>
                                    {winSide === 'left' ?
                                        (<h1>Left rat wins</h1>):
                                        (<h1>Right rat wins</h1>)
                                    }
                                </>
                            )}
                        </div>
                    </div>
                    <Rat id={ratsIds[1]} status={rightRatState} orientation='right'/>
                </div>

                <div className="row">
                    <Button
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
                                <input value={currentBet} onChange={e=>setCurrentBet(parseFloat(e.target.value))} max={5} min={0.01} type="number"/>
                                <span> sol</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        style={{width: '250px', padding: '1rem 0', fontSize: '3rem'}}
                        onClick={handleReady}
                    >
                        Ready
                    </Button>
                    <Button
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


export default CoinflipPage