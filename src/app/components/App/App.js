import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'
import Favicon from 'react-favicon'
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'

import * as ThingHelper from '../../../common/helpers/thing-helper'
import Flexbox from '../UI/Flexbox'
import SideBar from '../SideBar/SideBar'
import Login from '../Login/Login'
import Page from '../UI/Page'
import GlassPane from '../GlassPane/GlassPane'
import {GeneralConstants, GlassPaneIds} from '../../constants'
import * as PushService from '../../services/push-service'
import * as AuthService from '../../services/auth-service.js'
import FaviconLogo from '../../static/freection-favicon.png'
import {initialize, clean} from '../../util/analytics'
import * as DesktopNotificationService from '../../services/desktop-notification-service.js'
import * as ChromeExtensionActions from '../../actions/chrome-extension-actions'
import { closeExpanded } from '../../actions/message-box-actions'
import {goBack} from 'react-router-redux'
import CustomDragLayer from '../UI/CustomDragLayer'

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
        const {currentUser, dispatch} = this.props

        document.addEventListener('keydown', this.onKeyDown)

        if (currentUser.isAuthenticated) {
            PushService.listenToUpdates(currentUser.email, currentUser.pushToken, dispatch)
            AuthService.initialize(currentUser)
            DesktopNotificationService.initialize()
            initialize(currentUser)
            //EmailLifecycleService.initialize(dispatch)
        } else {
            clean()
        }
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

    listenToChromeExtension(event) {
        const {dispatch, config} = this.props
        if (event.data === GeneralConstants.CHROME_EXTENSION_MESSAGE && event.origin === config.baseUrl) {
            dispatch(ChromeExtensionActions.setIsInstalled(true))
        }
    }

    getTitle() {
        const {newNotifications} = this.props
        const notificationsPerThing = ThingHelper.groupNotificationsByThing(newNotifications)
        return notificationsPerThing && notificationsPerThing.length ? `Freection (${notificationsPerThing.length})` : 'Freection'
    }
    
    render () {
        const {currentUser, sheet: {classes}} = this.props

        // Add CustomDragLayer if the dragged items are not captured properly by the browser.

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
    newNotifications: PropTypes.array.isRequired,
    isExpandedOpen: PropTypes.bool.isRequired,
    isFullThingOpen: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth,
        config: state.config,
        newNotifications: state.whatsNew.notifications,
        isExpandedOpen: state.expandedMessageBox.opened,
        isFullThingOpen: state.thingPage.open,
    }
}

export default useSheet(connect(mapStateToProps)(DragDropContext(HTML5Backend)(App)), style)