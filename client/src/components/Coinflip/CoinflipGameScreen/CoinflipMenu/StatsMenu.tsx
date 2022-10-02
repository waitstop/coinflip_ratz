import {useLazyQuery} from "@apollo/client";
import {useWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import Box from "../../box/Box";
import {GET_USER_STATS} from "../../Querys";
import './coinflipStatsMenu.css'


const StatsMenu = () => {
    const [getUserStats] = useLazyQuery(GET_USER_STATS)
    const [stats, setStats] = useState({
        gamePlayed: 0,
        solGained: 0,
        favSide: 'N/A',
        bestWinStreak: 0
    })
    const {publicKey} = useWallet()

    useEffect(() => {
        if(!publicKey) return

        getUserStats({variables: {address: publicKey}})
            .then((res)=>{
                setStats(res.data.userStats)
            })
    }, [publicKey, getUserStats])

    return(
        <div className={'stats'}>
            <Box className={'stats-item'}>
                <span>game played:</span> <b>{stats.gamePlayed}</b>
            </Box>

            <Box className={'stats-item'}>
                <span>sol gained:</span> <b>{stats.solGained}</b>
            </Box>

            <Box className={'stats-item'}>
                <span>favorite side:</span> <b>{stats.favSide}</b>
            </Box>

            <Box className={'stats-item'}>
                <span>best winstreak:</span> <b>{stats.bestWinStreak}</b>
            </Box>
        </div>
    )
}


export default StatsMenu