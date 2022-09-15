import {FC, ReactNode} from "react";
require('./box.css')

type props = {
    children: ReactNode,
    style?: object,
    containerStyle?: object,
    className?: string
}

const Box: FC<props> = ({children, style, containerStyle, className}) => {
    return(
        <div
            style={containerStyle}
            className={'components-wrapper-box'}
        >
            <div
                className={`${className} components-box`}
                style={style}
            >
                {children}
            </div>
        </div>
    )
}

export default Box