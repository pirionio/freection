import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'

class WelcomeStep extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeStep.prototype)
    }

    render() {
        const {title, children, sheet: {classes}} = this.props

        return (
            <Flexbox name="welcome-step" container="column">
                <Flexbox name="title" alignSelf="center" className={classes.title}>
                    {title}
                </Flexbox>
                {children}
            </Flexbox>
        )
    }
}

const style = {
    title: {
        marginTop: 200,
        color: 'white',
        fontSize: '2.571em',
        fontWeight: '100',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    }
}

WelcomeStep.propTypes = {
    title: PropTypes.string.isRequired
}

export default useSheet(WelcomeStep, style)