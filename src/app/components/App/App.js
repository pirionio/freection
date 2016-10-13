import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'
import Favicon from 'react-favicon'

import * as ThingHelper from '../../helpers/thing-helper'
import Flexbox from '../UI/Flexbox'
import SideBar from '../SideBar/SideBar'
import Login from '../Login/Login'
import Page from '../UI/Page'
import GlassPane from '../GlassPane/GlassPane'
import {GlassPaneIds} from '../../constants'
import * as PushService from '../../services/push-service'
import * as AuthService from '../../services/auth-service.js'
import FaviconLogo from '../../static/freection-favicon.png'
import {initialize, clean} from '../../util/analytics'
import * as ChromeExtensionActions from '../../actions/chrome-extension-actions'

// import EmailLifecycleService from '../../services/email-lifecycle-service'

class App extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, App.prototype)
    }

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

    getTitle() {
        const {newNotifications} = this.props
        const notificationsPerThing = ThingHelper.groupNotificationsByThing(newNotifications)
        return notificationsPerThing && notificationsPerThing.length ? `Freection (${notificationsPerThing.length})` : 'Freection'
    }
    
    render () {
        const {currentUser, sheet: {classes}} = this.props

        if (currentUser.isAuthenticated) {
            return (
                <Page title={this.getTitle()} className={classes.page}>
                    <Flexbox name="root" container="row" className={classes.container}>
                        <Favicon url={FaviconLogo} />
                        <SideBar currentUser={currentUser} />
                        <Flexbox name="app-section" grow={1} container="column">
                            {this.props.children}
                        </Flexbox>
                        <GlassPane name={GlassPaneIds.WHOLE_APP} />
                    </Flexbox>
                </Page>
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
    page: {
        height: '100%',
        position: 'relative'
    },
    container: {
        height: '100%'
    }
}

App.propTypes = {
    currentUser: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    newNotifications: PropTypes.array.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth,
        config: state.config,
        newNotifications: state.whatsNew.notifications
    }
}

export default useSheet(connect(mapStateToProps)(App), style)