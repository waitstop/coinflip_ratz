import {FC, useState} from "react";
import Header from "../header/Header";
import Box from "../box/Box";
import previewImage from '../../../images/animations/animation_background.gif'
import Button from "../button/Button";

require('./coinflipHubPage.css')

const CoinflipHubPage: FC = () => {
    const [isFAQ, setIsFAQ] = useState<boolean>(false)

    return(
        <>
            <Header/>
            <div
                className={'hub-page-container'}
            >
                <Box
                    containerStyle={{
                        flexShrink: '0',
                        width: '1020px',
                        height: '570px',
                        overflow: 'hidden'
                    }}
                >
                    {!isFAQ && (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                background: `url(${previewImage})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    )}
                    {!!isFAQ && (
                        <div className={'hub-page-faq'}>
                            <h1>Frequently Asked Questions</h1>
                            <h2>What is The Duel Game?</h2>
                            <p>A smart contract that allows users to play Double or Nothing with their Solana tokens. Odds are 50/50 with a 3% fee</p>
                            <h2>Where can I track transactions?</h2>
                            <span>
                                <p>
                                    House Wallet:
                                    <br/>
                                    <a target={'_blank'} href="https://solscan.io/account/D6X9pm65p7NuWrgrYQUNU1M4qvAA7ASz4GWymGuPYrtw">
                                        https://solscan.io/account D6X9pm65p7NuWrgrYQUNU1M4qvAA7ASz4GWymGuPYrtw
                                    </a>
                                </p>
                            </span>
                            <span>
                                <p>
                                    Fee Wallet:
                                    <br/>
                                    <a target={'_blank'} href={'https://solscan.io/account/DAdbcE5SdqoQArf7V87pYR6jPNmTtEUbR2XeC1kAzZjh'}>
                                        https://solscan.io/account/DAdbcE5SdqoQArf7V87pYR6jPNmTtEUbR2XeC1kAzZjh
                                    </a>
                                </p>
                            </span>
                        </div>
                    )}
                </Box>

                <div className={'hub-page-right'}>
                    <h1>the duel game</h1>
                    <p>
                        <br/>
                        Put a bet and test your luck watching fellow ratz injuring each other because of your greed.
                        <br/>
                        <br/>
                        A Wild West styled solana coin flip game.
                    </p>
                    <div className="hub-page-buttons-container">
                        <Button
                            style={{
                                fontSize: '4rem'
                            }}
                            onClick={()=>setIsFAQ(prevState => !prevState)}
                        >
                            FAQ
                        </Button>
                        <Button
                            style={{
                                fontSize: '4rem'
                            }}

                        >
                            <a href="/">
                                Play now
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoinflipHubPage