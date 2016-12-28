import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../../UI/Flexbox'
import WelcomeStep from '../WelcomeStep'
import SingleStar from '../../../static/logo-single-white.png'

class WelcomeHowto extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeHowto.prototype)
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <WelcomeStep title="How to use Freection">
                <Flexbox name="explanation" className={classes.explanation}>
                    <Flexbox container="row" alignItems="center" className={classes.row}>
                        <img src={SingleStar} className={classes.bullet} />
                        <span>You are almost done!</span>
                    </Flexbox>
                    <Flexbox container="row" alignItems="center" className={classes.row}>
                        <img src={SingleStar} className={classes.bullet} />
                        <span>The best place to start is with the Getting Started message you will get from our Freection Bot.</span>
                    </Flexbox>
                    <Flexbox container="row" alignItems="center" className={classes.row}>
                        <img src={SingleStar} className={classes.bullet} />
                        <span>You will find it in your Freection Inbox. Just click on the message to learn how to use Freection.</span>
                    </Flexbox>
                </Flexbox>
            </WelcomeStep>
        )
    }
}

const style = {
    explanation: {
        marginTop: 55,
        padding: [0, 130],
        color: 'white',
        fontSize: '1.571em',
        fontWeight: '300',
        letterSpacing: '0.025em',
        lineHeight: '1.5'
    },
    row: {
        display: 'block',
        marginBottom: 50
    },
    bullet: {
        height: 15,
        width: 15,
        marginRight: 20
    }
}

WelcomeHowto.propTypes = {
}

export default useSheet(WelcomeHowto, style)