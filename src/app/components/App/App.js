import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import Favicon from 'react-favicon'

import Flexbox from '../UI/Flexbox'
import LoginTopBar from '../TopBar/LoginTopBar'
import SideBar from '../SideBar/SideBar'
import Login from '../Login/Login'
import GlassPane from '../GlassPane/GlassPane'
import * as PushService from '../../services/push-service'
import EmailLifecycleService from '../../services/email-lifecycle-service'
import FaviconLogo from '../../static/freection-favicon.png'

class App extends Component {
    componentDidMount() {
        const {currentUser, dispatch} = this.props

        if (currentUser.isAuthenticated) {
            PushService.listenToUpdates(currentUser.pushToken, dispatch)
            EmailLifecycleService.initialize(dispatch)
        }
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
                    <GlassPane />
                </Flexbox>
            )
        }

        return (
            <Flexbox name="root" container="column" className={classes.container}>
                <Favicon url={FaviconLogo} />
                <LoginTopBar />
                <Login />
            </Flexbox>
        )
    }
}

const style = {
    container: {
        height: '100%'
    }
}

App.propTypes = {
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(App), style)