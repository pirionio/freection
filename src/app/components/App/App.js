const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const radium = require('radium')

const Flexbox = require('../UI/Flexbox')
const SideBar = require('../SideBar/SideBar')
const Login = require('../Login/Login')
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
                <Flexbox container={true}>
                    <SideBar />
                    {this.props.children}
                </Flexbox>
            )
        } else {
            return (
                <Flexbox container={true}>
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

module.exports = connect(mapStateToProps)(radium(App))