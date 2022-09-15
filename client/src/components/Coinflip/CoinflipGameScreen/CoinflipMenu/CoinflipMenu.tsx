import Button from "../../button/Button";
import {useContext, useState} from "react";
import {CoinflipContext} from "../../../../Context/CoinflipContext";
import DepositMenu from "./DepositMenu";
import StatsMenu from "./StatsMenu";
import HistoryMenu from "./HistoryMenu";

const CoinflipMenu = () => {
    const [currentMenu, setCurrentMenu] = useState(0)
    const setIsMenu = useContext(CoinflipContext).setIsMenu

    return(
        <div style={{width: '100%', height: '100%'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row' as 'row',
                flexWrap: 'nowrap',
                padding: '1rem'
            }}>
                <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row' as 'row',
                        flexWrap: 'nowrap',
                        gap: '1rem'
                    }}
                >
                    <Button
                        style={{
                            backgroundColor: currentMenu === 0 ? '#6D6D6D' : '#999999',
                            border: currentMenu === 0 ? '0.1em outset #999999':'0.1em outset #BFBFBF',
                        }}
                        onClick={()=>setCurrentMenu(0)}
                    >
                        deposit
                    </Button>
                    <Button
                        style={{
                            backgroundColor: currentMenu === 1 ? '#6D6D6D' : '#999999',
                            border: currentMenu === 1 ? '0.1em outset #999999':'0.1em outset #BFBFBF',
                        }}
                        onClick={()=>setCurrentMenu(1)}
                    >
                        stats
                    </Button>
                    <Button
                        style={{
                            backgroundColor: currentMenu === 2 ? '#6D6D6D' : '#999999',
                            border: currentMenu === 2 ? '0.1em outset #999999':'0.1em outset #BFBFBF',
                        }}
                        onClick={()=>setCurrentMenu(2)}
                    >
                        history
                    </Button>
                </div>
                <Button onClick={()=> {
                    if(!setIsMenu) return
                    setIsMenu(false)
                }}>X</Button>
            </div>
            {currentMenu === 0 && (<DepositMenu/>)}
            {currentMenu === 1 && (<StatsMenu/>)}
            {currentMenu === 2 && (<HistoryMenu/>)}
        </div>
    )
}

export default CoinflipMenu