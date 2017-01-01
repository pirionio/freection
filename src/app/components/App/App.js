import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'
import Favicon from 'react-favicon'
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'

import * as ThingHelper from '../../../common/helpers/thing-helper'
import Flexbox from '../UI/Flexbox'
import Page from '../UI/Page'
import {GeneralConstants} from '../../constants'
import * as PushService from '../../services/push-service'
import * as AuthService from '../../services/auth-service.js'
import FaviconLogo from '../../static/freection-favicon.png'
import {initialize, clean} from '../../util/analytics'
import * as DesktopNotificationService from '../../services/desktop-notification-service.js'
import * as ChromeExtensionActions from '../../actions/chrome-extension-actions'
import { closeExpanded } from '../../actions/message-box-actions'
import {goBack} from 'react-router-redux'
import WelcomeStatus from '../../../common/enums/welcome-status'

// import EmailLifecycleService from '../../services/email-lifecycle-service'

class App extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, App.prototype)
    }

    onKeyDown(event) {
        if (event.key === 'Escape') {
            const {isExpandedOpen, isFullThingOpen, dispatch} = this.props
            if (isExpandedOpen) {
                dispatch(closeExpanded())
            } else if (isFullThingOpen) {
                dispatch(goBack())
            }
        }
    }

    componentDidMount() {
        const {auth, currentUser, dispatch} = this.props

        document.addEventListener('keydown', this.onKeyDown)

        if (auth.isAuthenticated) {
            PushService.listenToUpdates(currentUser.email, auth.pushToken, dispatch)
            AuthService.initialize(currentUser)
            DesktopNotificationService.initialize()
            initialize(currentUser)
            //EmailLifecycleService.initialize(dispatch)
        } else {
            clean()
        }
        
        this.determineInitialRoute()
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown)
        document.removeEventListener('message', this.listenToChromeExtension)
    }

    componentWillMount() {
        // This is the way to communicate with the Chrome Extension.
        // It is risky, since we accept messages from outside, so we accept only messages from our same origin.
        window.addEventListener('message', this.listenToChromeExtension, false)
    }

    determineInitialRoute() {
        const {auth, currentUser, location} = this.props
        const {router} = this.context

        if (!auth.isAuthenticated) {
            router.replace('/login')
        } else if (currentUser.welcomeStatus !== WelcomeStatus.DONE.key && currentUser.welcomeStatus !== WelcomeStatus.SKIPPED.key) {
            router.replace({
                pathname: '/welcome',
                query: location.query || undefined
            })
        }
    }

    listenToChromeExtension(event) {
        const {dispatch, config} = this.props
        if (event.data === GeneralConstants.CHROME_EXTENSION_MESSAGE && event.origin === config.baseUrl) {
            dispatch(ChromeExtensionActions.setIsInstalled(true))
        }
    }

    getTitle() {
        const {auth, currentUser, newNotifications} = this.props

        if (!auth.isAuthenticated)
            return 'Freection Login'

        if (currentUser.welcomeStatus !== WelcomeStatus.DONE.key && currentUser.welcomeStatus !== WelcomeStatus.SKIPPED.key)
            return 'Freection Welcome'

        const notificationsPerThing = ThingHelper.groupNotificationsByThing(newNotifications)
        return notificationsPerThing && notificationsPerThing.length ? `Freection (${notificationsPerThing.length})` : 'Freection'
    }
    
    render () {
        const {children, sheet: {classes}} = this.props

        return (
            <Page title={this.getTitle()} className={classes.page}>
                <Flexbox name="root" container="column" className={classes.container}>
                    <Favicon url={FaviconLogo} />
                    {children}
                </Flexbox>
            </Page>
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
    auth: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    newNotifications: PropTypes.array.isRequired,
    isExpandedOpen: PropTypes.bool.isRequired,
    isFullThingOpen: PropTypes.bool.isRequired
}

App.contextTypes = {
    router: PropTypes.object
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        currentUser: state.userProfile,
        config: state.config,
        newNotifications: state.whatsNew.notifications,
        isExpandedOpen: state.expandedMessageBox.opened,
        isFullThingOpen: state.thingPage.open,
    }
}

export default useSheet(connect(mapStateToProps)(DragDropContext(HTML5Backend)(App)), style)