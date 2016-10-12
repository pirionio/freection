import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import Favicon from 'react-favicon'

import Flexbox from '../UI/Flexbox'
import SideBar from '../SideBar/SideBar'
import Login from '../Login/Login'
import GlassPane from '../GlassPane/GlassPane'
import {GlassPaneIds} from '../../constants'
import * as PushService from '../../services/push-service'
import * as AuthService from '../../services/auth-service.js'
import FaviconLogo from '../../static/freection-favicon.png'
import {initialize, clean} from '../../util/analytics'
import * as ChromeExtensionActions from '../../actions/chrome-extension-actions'

// import EmailLifecycleService from '../../services/email-lifecycle-service'

class App extends Component {
    componentDidMount() {
        const {currentUser, dispatch} = this.props

        if (currentUser.isAuthenticated) {
            PushService.listenToUpdates(currentUser.email, currentUser.pushToken, dispatch)
            AuthService.initialize(currentUser)
            initialize(currentUser)
            //EmailLifecycleService.initialize(dispatch)
        } else {
            clean()
        }
    }

    componentWillMount() {
        const {dispatch, config} = this.props

        // This is the way to communicate with the Chrome Extension.
        // It is risky, since we accept messages from outside, so we accept only messages from our same origin.
        window.addEventListener('message', event => {
            if (event.origin === config.baseUrl) {
                dispatch(ChromeExtensionActions.setIsInstalled(true))
            }
        }, false)
    }

    render () {
        const {currentUser, sheet: {classes}} = this.props

        if (currentUser.isAuthenticated) {
            return (
                <Flexbox name="root" container="row" className={classes.container}>
                    <Favicon url={FaviconLogo} />
                    <SideBar currentUser={currentUser} />
                    <Flexbox name="app-section" grow={1} container="column">
                        {this.props.children}
                    </Flexbox>
                    <GlassPane name={GlassPaneIds.WHOLE_APP} />
                </Flexbox>
            )
        }

        return (
            <Flexbox name="root" container="column" className={classes.container}>
                <Favicon url={FaviconLogo} />
                <Login />
            </Flexbox>
        )
    }
}

const style = {
    container: {
        height: '100%',
        position: 'relative'
    }
}

App.propTypes = {
    currentUser: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth,
        config: state.config
    }
}

export default useSheet(connect(mapStateToProps)(App), style)