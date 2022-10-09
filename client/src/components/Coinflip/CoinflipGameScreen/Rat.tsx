import {FC} from "react";
import './rat.css'


export const RATS = [
    {
        name: 'John Ratto',
        img_alive: require('../../../images/alive/rat_1.png'),
        img_dead: require('../../../images/dead/rat_1.png'),
        speech: 'Looking for a trouble, partner? Get out of here!',
        speech_win: 'Sorry, kid',
        speech_dead: 'Ughhhhh...',
        items: [
            require('../../../images/items/revolver_4.png'),
            require('../../../images/items/beans.png'),
            require('../../../images/items/rope.png'),
            require('../../../images/items/noitem.png'),
        ]
    },
    {
        name: 'Bob Ratsky',
        img_alive: require('../../../images/alive/rat_2.png'),
        img_dead: require('../../../images/dead/rat_2.png'),
        speech: 'Don`t try me! You`re in way over your head!',
        speech_win: 'You should have listened to me.',
        speech_dead: 'Oh... God...',
        items: [
            require('../../../images/items/revolver_1.png'),
            require('../../../images/items/cig.png'),
            require('../../../images/items/glass.png'),
            require('../../../images/items/noitem.png'),
        ]
    },
    {
        name: 'Silva de Mice',
        img_alive: require('../../../images/alive/rat_3.png'),
        img_dead: require('../../../images/dead/rat_3.png'),
        speech: 'You making a big mistake, my friend!',
        speech_win: 'Se la vie.',
        speech_dead: '...',
        items: [
            require('../../../images/items/revolver_2.png'),
            require('../../../images/items/watch.png'),
            require('../../../images/items/coin.png'),
            require('../../../images/items/noitem.png'),
        ]
    },
    {
        name: 'Squicky Joe',
        img_alive: require('../../../images/alive/rat_4.png'),
        img_dead: require('../../../images/dead/rat_4.png'),
        speech: 'You gotta be dumb to challenge me, boy.',
        speech_win: 'Ha-ha-ha, bring the coffin!',
        speech_dead: 'Aarrgh! You, bustar...',
        items: [
            require('../../../images/items/revolver_3.png'),
            require('../../../images/items/bottle.png'),
            require('../../../images/items/tnt.png'),
            require('../../../images/items/noitem.png')
        ]
    },

]

type props = {
    id?: number,
    status?: String,
    orientation?: String
}

export const Rat: FC<props> = ({id=0, status='normal', orientation='left'}) => {
    return(
        <div className="rat">
            <div className={'out-border'} style={{marginBottom: '-4px'}}>
                <span className={"border rat-name"}>{RATS[id].name}</span>
            </div>

            <div className={"out-border"}>
                {status === 'normal' && (
                    <span className={"border rat-speech"}>{RATS[id].speech}</span>
                )}
                {status === 'dead' && (
                    <span className={"border rat-speech"}>{RATS[id].speech_dead}</span>
                )}
                {status === 'win' && (
                    <span className={"border rat-speech"}>{RATS[id].speech_win}</span>
                )}
            </div>

            <div className={"out-border"} style={{zIndex: 3, marginTop: '-4px'}}>
                <div className={"border"} style={{zIndex: 2, display: 'flex', backgroundColor: '#004149', overflow: 'hidden'}}>
                    <img
                        className={'avatar'}
                        style={{transform: orientation === 'left' ? 'scaleX(-1)': ''}}
                        src={status==='dead' ? RATS[id].img_dead: RATS[id].img_alive}
                        alt="rat"
                    />
                </div>
            </div>

            <div className={"out-border"} style={{zIndex: 4,  marginTop: '-4px'}}>
                <div className={"border"}>
                    <div className={'hp-bar'} style={{width: status !== 'dead' ? '100%': '10%'}}/>
                </div>
            </div>

            <div className={"item-container"}>
                {RATS[id].items.map((item, index) => (
                    <div key={index} className="item">
                        <img src={item} alt="item"/>
                    </div>
                ))}
            </div>


        </div>
    )
}