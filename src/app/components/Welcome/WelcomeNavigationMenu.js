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
import {WelcomeWizardConstants} from '../../constants'

class WelcomeNavigationMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeNavigationMenu.prototype)
    }

    getStepButton(welcomeStatus, index) {
        const {currentUser, sheet: {classes}} = this.props

        const isCurrent = currentUser.welcomeStatus === welcomeStatus.key

        const buttonClass = index < SharedConstants.WELCOME_WIZARD_STEPS.length - 2 ? classes.stepLink : null

        return (
            <a key={welcomeStatus.key} onClick={() => this.navigate(welcomeStatus)} className={buttonClass}>
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
        height: WelcomeWizardConstants.NAVIGATION_MENU_HEIGHT,
        marginBottom: WelcomeWizardConstants.NAVIGATION_MENU_MARGIN,
        position: 'relative'
    },
    link: {
        position: 'absolute',
        right: -35,
        width: 35,
        color: styleVars.highlightColor,
        letterSpacing: '0.05em',
        textDecoration: 'none',
        cursor: 'pointer',
        paddingLeft: 18
    },
    stepLink: {
        marginRight: 18
    },
    ellipse: {
        height: 15,
        width: 15,
        cursor: 'pointer'
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