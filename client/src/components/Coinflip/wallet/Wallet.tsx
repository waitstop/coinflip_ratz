import {FC, ReactNode, useMemo} from 'react'
import {clusterApiUrl} from "@solana/web3.js";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-phantom";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {network} from "../../../config";

require('@solana/wallet-adapter-react-ui/styles.css');
require('./wallet.css')

const Wallet: FC<{children: ReactNode}> = ({children}) => {
    const endpoint = useMemo(() => clusterApiUrl(network), []);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        []
    )


    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider className={"custom-wallet-modal"}>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}


export default Wallet