import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import findIndex from 'lodash/findIndex'
import last from 'lodash/last'

import Flexbox from '../UI/Flexbox'
import Ellipse from '../UI/Ellipse'
import styleVars from '../style-vars'
import SharedConstants from '../../../common/shared-constants'
import * as WelcomeActions from '../../actions/welcome-actions'

class WelcomeNavigationMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeNavigationMenu.prototype)
    }

    getStepButton(welcomeStatus) {
        const {currentUser, sheet: {classes}} = this.props

        const isCurrent = currentUser.welcomeStatus === welcomeStatus.key

        return (
            <a key={welcomeStatus.key} onClick={() => this.navigate(welcomeStatus)}>
                <Ellipse color={isCurrent ? styleVars.highlightColor : styleVars.primaryColor} oval={false} className={classes.ellipse} />
            </a>
        )
    }

    navigate(welcomeStatus) {
        const {dispatch} = this.props
        dispatch(WelcomeActions.setWelcomeStatus(welcomeStatus.key))
    }

    getSteps() {
        return SharedConstants.WELCOME_WIZARD_STEPS.slice(0, -1).map(this.getStepButton)
    }

    getAction() {
        const {currentUser, sheet: {classes}} = this.props

        const currentStatusIndex = findIndex(SharedConstants.WELCOME_WIZARD_STEPS, {key: currentUser.welcomeStatus})
        const nextStatus = (currentStatusIndex + 1 < SharedConstants.WELCOME_WIZARD_STEPS.length) ?
            SharedConstants.WELCOME_WIZARD_STEPS[currentStatusIndex + 1] :
            last(SharedConstants.WELCOME_WIZARD_STEPS)

        // If the current step is one before last, show a Done action. Otherwise show a Next action.
        return currentStatusIndex === SharedConstants.WELCOME_WIZARD_STEPS.length - 2 ?
            <a className={classes.link} key="Done" onClick={() => this.navigate(nextStatus)}>Done!</a> :
            <a className={classes.link} key="Next" onClick={() => this.navigate(nextStatus)}>Next</a>
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="navigation-menu" container="row" className={classes.navigationMenu}>
                {this.getSteps()}
                {this.getAction()}
            </Flexbox>
        )
    }
}

const style = {
    navigationMenu: {
        marginBottom: 15,
        position: 'relative'
    },
    link: {
        position: 'absolute',
        right: -35,
        width: 35,
        color: styleVars.highlightColor,
        fontSize: '0.857em',
        letterSpacing: '0.05em',
        textDecoration: 'none',
        cursor: 'pointer'
    },
    ellipse: {
        height: 12,
        width: 12,
        cursor: 'pointer',
        '&:not(last-of-type)': {
            marginRight: 18,
        }
    }
}

WelcomeNavigationMenu.propTypes = {
    currentUser: PropTypes.object.isRequired
}

WelcomeNavigationMenu.contextTypes = {
    router: PropTypes.object
}

function mapStateToProps(state) {
    return {
        currentUser: state.userProfile
    }
}

export default useSheet(connect(mapStateToProps)(WelcomeNavigationMenu), style)