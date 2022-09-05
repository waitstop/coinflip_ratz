import {createContext, Dispatch} from "react";

type props = {
    isMenu: boolean|null,
    setIsMenu: Dispatch<boolean>|null,
    balance: number|null,
    setBalance: Dispatch<number>|null
}
export const CoinflipContext = createContext<props>({
    isMenu: null,
    setIsMenu: null,
    balance: null,
    setBalance: null
})