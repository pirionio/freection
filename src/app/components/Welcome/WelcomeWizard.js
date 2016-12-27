import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import FreectionLogo from '../../static/logo-white.png'
import WelcomeStatus from '../../../common/enums/welcome-status'

class WelcomeWizard extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeWizard.prototype)
    }

    componentDidMount() {
        const {currentUser} = this.props
        const {router} = this.context

        console.log('currentUser:', currentUser)

        if (currentUser.welcomeStatus === WelcomeStatus.INTRO.key)
            router.replace('/welcome/intro')
        else if (currentUser.welcomeStatus === WelcomeStatus.INTEGRATIONS.key)
            router.replace('/welcome/integrations')
        else if (currentUser.welcomeStatus === WelcomeStatus.HOWTO.key)
            router.replace('/welcome/howto')
    }

    render() {
        const {children, sheet: {classes}} = this.props

        return (
            <Flexbox name="welcome-container" container="column" className={classes.container}>
                <Flexbox name="welcome-content" container="column" alignItems="center" alignSelf="center" className={classes.content}>
                    <Flexbox name="logo">
                        <img src={FreectionLogo} className={classes.logo} />
                    </Flexbox>
                    {children}
                    <Flexbox name="sign-out" className={classes.signOut}>
                        <a href="/login/logout">
                            <Icon name="sign-out" />
                        </a>
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
        backgroundColor: styleVars.backgroundColor
    },
    content: {
        height: '100%',
        width: 773,
        backgroundColor: styleVars.basePurpleColor,
        position: 'relative'
    },
    logo: {
        height: 24,
        width: 78,
        marginTop: 48
    },
    signOut: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        '& a': {
            color: 'black'
        }
    }
}

WelcomeWizard.propTypes = {

}

WelcomeWizard.contextTypes = {
    router: PropTypes.object
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(WelcomeWizard), style)