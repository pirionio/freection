import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import {WelcomeWizardConstants} from '../../constants'

class WelcomeStep extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeStep.prototype)
    }

    render() {
        const {title, children, sheet: {classes}} = this.props

        return (
            <Flexbox name="welcome-step" container="column" className={classes.container}>
                <Flexbox name="title" alignSelf="center" className={classes.title}>
                    {title}
                </Flexbox>
                {children}
            </Flexbox>
        )
    }
}

const STEP_MARGIN = WelcomeWizardConstants.LOGO_HEIGHT + WelcomeWizardConstants.LOGO_MARGIN +
    WelcomeWizardConstants.NAVIGATION_MENU_HEIGHT + WelcomeWizardConstants.NAVIGATION_MENU_MARGIN +
    (WelcomeWizardConstants.STEP_MARGIN * 2)

const style = {
    container: {
        maxHeight: `calc(100% - ${STEP_MARGIN}px)`
    },
    title: {
        marginTop: 25,
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