import {FC, ReactNode, MouseEventHandler} from "react";
require('./button.css')

type props = {
    children: ReactNode,
    style?: object,
    onClick?: MouseEventHandler,
    disabled?: boolean
}

const Button:FC<props> = ({children, style, onClick, disabled= false}) => {
    return (
        <button
            className={'components-button'}
            disabled={disabled}
            style={style}
            onClick={disabled? ()=>{return}:onClick}
        >
            {children}
        </button>
    )
}


export default Button