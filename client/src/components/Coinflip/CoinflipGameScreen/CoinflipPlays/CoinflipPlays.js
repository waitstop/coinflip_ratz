import './coinflipPlays.css'
import {GET_GAME_HISTORY} from "../../Querys";
import {useLazyQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import moment from "moment";

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

const CoinflipPlays = () => {
    const winStrings = [
        "got luck on its side",
        "made it"
    ]
    const loseStrings = [
        "didnt make it",
        "lost it all",
        "had to regret it"
    ]
    const [getHistory] = useLazyQuery(GET_GAME_HISTORY)
    const [history, setHistory] = useState([])
    useEffect(() => {

        getHistory({variables: {limit: 5}})
            .then(res => {
                const newHistory = []
                for (let i = 0; i < res.data.history.length; i++) {
                    newHistory.push({
                        ...res.data.history[i],
                        title: res.data.history[i].result === "win" ? winStrings[randomNumber(0, winStrings.length)]:loseStrings[randomNumber(0, loseStrings.length)]
                    })
                }
                setHistory(newHistory)
            })

        const interval = setInterval(()=>{
            getHistory({variables: {limit: 5}})
                .then(res => {
                    const newHistory = []
                    for (let i = 0; i < res.data.history.length; i++) {
                        newHistory.push({
                            ...res.data.history[i],
                            title: res.data.history[i].result === "win" ? winStrings[randomNumber(0, winStrings.length)]:loseStrings[randomNumber(0, loseStrings.length)]
                        })
                    }
                    setHistory(newHistory)
                })
        }, 10000)

        return () => clearInterval(interval)

    }, []);

    return (
        <div className={"play_history"}>
            <h1>Recent plays</h1>
            <div className={"play_history__container"}>
                {history.map((el, index) => (
                    <div key={index} className={"play_history__container__row"}>
                        <p>
                            Wallet ({el.address})
                            bet <b>{el.bet} sol </b>
                            and <b>{el.title}</b>.
                        </p>
                        <span>
                    {
                        moment(Date.now()).from(new Date(el.date), true).toString()
                    }
                  </span>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default CoinflipPlays