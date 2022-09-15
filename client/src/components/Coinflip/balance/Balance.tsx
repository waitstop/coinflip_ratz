import {FC} from "react";
require('./balance.css')

type props = {
    balance: number
}

const Balance: FC<props> = ({balance}) => {
    return(
        <div className={'components-balance-wrapper'}>
            <span className={'components-balance-text'}>balance: </span>
            <span className={'components-balance-amount'}>{balance} sol</span>
        </div>
    )
}

export default Balance