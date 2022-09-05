import {FC, ReactNode, MouseEventHandler, useState} from "react";

type props = {
    children: ReactNode,
    style?: object,
    onClick?: MouseEventHandler
}

const Button:FC<props> = ({children, style, onClick}) => {
    const [pressed, setPressed] = useState(false)

    const defaultStyle = {
        color: 'black',
        cursor: 'pointer',
        padding: '0 0.5em',
        fontFamily: 'OpenSansPX, sans-serif',
        fontSize: '2rem',
        backgroundColor: pressed ? '#6D6D6D':'#999999',
        borderRadius: 'none',
        border: pressed ? '0.1em outset #999999':'0.1em outset #BFBFBF',
        outline: '0.03em solid #474747'
    }

    return (
        <button
            onMouseDown={() => setPressed(true)}
            onMouseLeave={() => setPressed(false)}
            onMouseUp={() => setPressed(false)}
            style={{...defaultStyle, ...style}}
            onClick={onClick}
        >
            {children}
        </button>
    )
}


export default Button