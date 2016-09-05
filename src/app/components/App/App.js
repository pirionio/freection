const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const useSheet = require('react-jss').default

const Flexbox = require('../UI/Flexbox')
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
        const {currentUser, sheet: {classes}} = this.props

        if (currentUser.isAuthenticated) {
            return (
                <Flexbox name="root" container="row" className={classes.container}>
                    <SideBar currentUser={currentUser} />
                    <Flexbox name="app-section" grow={1} container="column">
                        {this.props.children}
                    </Flexbox>
                    <GlassPane />
                </Flexbox>
            )
        } else {
            return (
                <Flexbox name="root" container="column" className={classes.container}>
                    <LoginTopBar />
                    <Login />
                </Flexbox>
            )
        }
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = useSheet(connect(mapStateToProps)(App), style)