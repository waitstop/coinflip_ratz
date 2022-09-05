import {FC} from "react";

type props = {
    balance: number
}


const Balance: FC<props> = ({balance}) => {
    const defaultStyle = {
        gap: '0.5em',
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        fontFamily: 'OpenSansPX, sans-serif',
        padding: '0.1em 0.5em',
        fontSize: '2rem',
        border: '0.1em outset #BFBFBF',
        outline: '0.03em solid #474747',
        backgroundColor: '#999999'
    }

    const amountStyle = {
        backgroundColor: '#848484',
        padding: '0.1em 0.5em',
        border: '0.1em inset #BFBFBF',
        color: '#313131'
    }

    return(
        <div style={defaultStyle}>
            <span>balance: </span>
            <span style={amountStyle}>{balance} sol</span>
        </div>
    )
}


export default Balance