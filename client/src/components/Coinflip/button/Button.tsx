import {FC, ReactNode, MouseEventHandler} from "react";
require('./button.css')

type props = {
    children: ReactNode,
    style?: object,
    onClick?: MouseEventHandler,
    disabled?: boolean,
    hintText?: string,
    showHint?: boolean,
    className?: string
}

const Button:FC<props> = ({children, style, onClick, disabled= false, showHint = true, hintText, className}) => {
    return (
        <button
            data-hint={(!!hintText && showHint) ? hintText:undefined}
            className={`components-button ${className}`}
            disabled={disabled}
            style={style}
            onClick={disabled? ()=>{return}:onClick}
        >
            {children}
        </button>
    )
}


export default Button