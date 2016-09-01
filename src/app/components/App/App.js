const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const Flexbox = require('../UI/Flexbox')
const TopBar = require('../TopBar/TopBar')
const LoginTopBar = require('../TopBar/LoginTopBar')
const SideBar = require('../SideBar/SideBar')
const Login = require('../Login/Login')
const GlassPane = require('../GlassPane/GlassPane')
const PushService = require('../../services/push-service')
const EmailLifecycleService = require('../../services/email-lifecycle-service')

class App extends Component {
    componentDidMount() {
        const {currentUser, dispatch} = this.props

        if (currentUser.isAuthenticated) {
            PushService.listenToUpdates(currentUser.pushToken, dispatch)
            EmailLifecycleService.initialize(dispatch)
        }
    }

    render () {
        const {currentUser} = this.props

        if (currentUser.isAuthenticated) {
            return (
                <Flexbox name="root" container="row" height="100%">
                    <SideBar currentUser={currentUser} />
                    <Flexbox name="app-section" grow={1} container="column">
                        {this.props.children}
                    </Flexbox>
                    <GlassPane />
                </Flexbox>
            )
        } else {
            return (
                <Flexbox name="root" container="column" height="100%">
                    <LoginTopBar />
                    <Login />
                </Flexbox>
            )
        }
    }
}

App.propTypes = {
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(App)