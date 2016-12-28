import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import findIndex from 'lodash/findIndex'

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

    getButton(welcomeStatus) {
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
    
    render() {
        const {currentUser, sheet: {classes}} = this.props

        const currentStatusIndex = findIndex(SharedConstants.WELCOME_WIZARD_STEPS, {key: currentUser.welcomeStatus})

        const menu = SharedConstants.WELCOME_WIZARD_STEPS.map((welcomeStatus, index) => {
            if (index === SharedConstants.WELCOME_WIZARD_STEPS.length - 1) {
                if (index === currentStatusIndex + 1)
                    return <a className={classes.link} key="Done" onClick={() => this.navigate(welcomeStatus)}>Done!</a>

                const nextStatus = SharedConstants.WELCOME_WIZARD_STEPS[currentStatusIndex + 1]
                return <a className={classes.link} key="Next" onClick={() => this.navigate(nextStatus)}>Next</a>
            }

            return this.getButton(welcomeStatus)
        })

        return (
            <Flexbox name="navigation-menu" container="row" className={classes.navigationMenu}>
                {menu}
            </Flexbox>
        )
    }
}

const style = {
    navigationMenu: {
        marginBottom: 15
    },
    link: {
        color: styleVars.highlightColor,
        fontSize: '0.857em',
        letterSpacing: '0.05em',
        textDecoration: 'none',
        cursor: 'pointer'
    },
    ellipse: {
        height: 12,
        width: 12,
        marginRight: 18,
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