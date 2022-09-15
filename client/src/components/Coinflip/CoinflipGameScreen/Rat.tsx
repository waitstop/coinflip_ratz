import {FC} from "react";

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
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        width: '320px'
    }
    const outerBorder = {
        border: '4px solid #474747',
        padding: '4px',
        backgroundColor: '#999999'
    }
    const borderStyle = {
        border: '4px inset #BFBFBF',
        backgroundColor: '#999999'
    }
    const textStyle = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        fontFamily: 'OpenSansPX, sans-serif',
        padding: '0.1em 0.5em',
        fontSize: '2rem',
    }
    const imageStyle = {
        width: '100%',
        height: 'auto',
        aspectRatio: '1/1'
    }
    const hpBarStyle = {
        transition: 'all 1s cubic-bezier(0, 0, 0, 1) 0s',
        height: '1.5em',
        backgroundColor: '#A82020'
    }

    const itemsContainer = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'nowrap' as 'nowrap',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center'
    }
    const itemStyle = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'nowrap' as 'nowrap',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#848484',
        width: '25%',
        height: 'auto',
        aspectRatio: '1/1',
        border: '4px inset #BFBFBF'
    }


    return(
        <div className="rat" style={containerStyle}>
            <div style={{...outerBorder, marginBottom: '-4px'}}>
                <span style={{...borderStyle, ...textStyle, fontWeight: 600}}>{RATS[id].name}</span>
            </div>

            <div style={outerBorder}>
                {status === 'normal' && (
                    <span style={{...borderStyle, ...textStyle, height: '123px'}}>{RATS[id].speech}</span>
                )}
                {status === 'dead' && (
                    <span style={{...borderStyle, ...textStyle, height: '123px'}}>{RATS[id].speech_dead}</span>
                )}
                {status === 'win' && (
                    <span style={{...borderStyle, ...textStyle, height: '123px'}}>{RATS[id].speech_win}</span>
                )}
            </div>

            <div style={{...outerBorder, zIndex: 3, marginTop: '-4px'}}>
                <div style={{...borderStyle, zIndex: 2, display: 'flex', backgroundColor: '#004149', overflow: 'hidden'}}>
                    <img
                        style={{...imageStyle, transform: orientation === 'left' ? 'scaleX(-1)': ''}}
                        src={status==='dead' ? RATS[id].img_dead: RATS[id].img_alive}
                        alt="rat"
                    />
                </div>
            </div>

            <div style={{...outerBorder, zIndex: 4,  marginTop: '-4px'}}>
                <div style={{...borderStyle}}>
                    <div style={{...hpBarStyle, width: status !== 'dead' ? '100%': '10%'}}/>
                </div>
            </div>

            <div style={{...itemsContainer, border: '4px solid #474747', padding: '4px', backgroundColor: '#999999', marginTop: '-4px'}}>
                {RATS[id].items.map((item, index) => (
                    <div key={index} className="item" style={{...itemStyle, overflow: 'hidden'}}>
                        <img src={item} style={{transform: 'scale(0.95)', width: '60px', height: '60px'}} alt="item"/>
                    </div>
                ))}
            </div>


        </div>
    )
}