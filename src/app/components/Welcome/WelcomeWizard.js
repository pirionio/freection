import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import WelcomeNavigationMenu from './WelcomeNavigationMenu'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import FreectionLogo from '../../static/logo-white.png'
import WelcomeStatus from '../../../common/enums/welcome-status'
import * as WelcomeActions from '../../actions/welcome-actions'
import {WelcomeWizardConstants} from '../../constants'

class WelcomeWizard extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeWizard.prototype)
    }

    componentDidMount() {
        this.determineStep()
    }

    componentDidUpdate() {
        this.determineStep()
    }

    determineStep() {
        const {currentUser, location} = this.props
        const {router} = this.context

        const userWelcomeStatus = WelcomeStatus[currentUser.welcomeStatus]

        if (location && location.pathname.indexOf(userWelcomeStatus.path) === -1) {
            const fullPath = router.createHref(`/welcome${userWelcomeStatus.path}`)
            router.replace({
                pathname: fullPath,
                query: location.query || undefined
            })
        }
    }

    skip() {
        const {dispatch} = this.props
        dispatch(WelcomeActions.setWelcomeStatus(WelcomeStatus.SKIPPED.key))
    }

    render() {
        const {children, sheet: {classes}} = this.props

        return (
            <Flexbox name="welcome-container" container="column" className={classes.container}>
                <Flexbox name="welcome-content" container="column" alignItems="center" alignSelf="center" className={classes.content}>
                    <Flexbox name="logo">
                        <img src={FreectionLogo} className={classes.logo} />
                    </Flexbox>
                    <Flexbox name="welcome-steps" grow={1} shrink={0} className={classes.steps}>
                        {children}
                    </Flexbox>
                    <WelcomeNavigationMenu />
                    <Flexbox name="sign-out" container="row" className={classes.signOut}>
                        <a onClick={this.skip}>Skip</a>
                        <span> / </span>
                        <a href="/login/logout">Sign out</a>
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        height: '100%',
        width: '100%',
        minHeight: 600,
        backgroundColor: styleVars.backgroundColor
    },
    content: {
        height: '100%',
        width: 773,
        backgroundColor: styleVars.basePurpleColor,
        position: 'relative'
    },
    logo: {
        height: WelcomeWizardConstants.LOGO_HEIGHT,
        width: 78,
        marginTop: WelcomeWizardConstants.LOGO_MARGIN
    },
    steps: {
        margin: [WelcomeWizardConstants.STEP_MARGIN, 0],
        overflowY: 'hidden'
    },
    signOut: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        color: 'a6a6a6',
        '& a': {
            textDecoration: 'none',
            color: 'a6a6a6',
            cursor: 'pointer'
        },
        '& span': {
            margin: [0, 5]
        }
    }
}

WelcomeWizard.propTypes = {
    currentUser: PropTypes.object.isRequired
}

WelcomeWizard.contextTypes = {
    router: PropTypes.object
}

function mapStateToProps(state) {
    return {
        currentUser: state.userProfile
    }
}

export default useSheet(connect(mapStateToProps)(WelcomeWizard), style)