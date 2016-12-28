import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../../UI/Flexbox'
import WelcomeStep from '../WelcomeStep'
import SingleStar from '../../../static/logo-single-white.png'

class WelcomeIntro extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeIntro.prototype)
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <WelcomeStep title="Welcome to Freection!">
                <Flexbox name="explanation" className={classes.explanation}>
                    <Flexbox container="row" alignItems="center" className={classes.row}>
                        <img src={SingleStar} className={classes.bullet} />
                        <span>Freection is a unified and collaborative tasks platform for the entire organization.</span>
                    </Flexbox>
                    <Flexbox container="row" alignItems="center" className={classes.row}>
                        <img src={SingleStar} className={classes.bullet} />
                        <span>It aggregates all of your tasks from all of the applications you work with.</span>
                    </Flexbox>
                    <Flexbox container="row" alignItems="center" className={classes.row}>
                        <img src={SingleStar} className={classes.bullet} />
                        <span>It shows you the tasks that you wait for, on the boards of others.</span>
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

WelcomeIntro.propTypes = {
}

export default useSheet(WelcomeIntro, style)