const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const TopBar = require('../TopBar/TopBar')
const SideBar = require('../SideBar/SideBar')
const Login = require('../Login/Login')
const PushService = require('../../services/push-service')

class App extends Component {
    componentDidMount() {
        PushService.listenToUpdates(this.props.pushToken, this.props.dispatch)
    }

    render () {
        const {isAuthenticated} = this.props

        if (isAuthenticated) {
            return (
                <div className="app-root">
                    <TopBar />
                    <SideBar />
                    {this.props.children}
                </div>
            )
        } else {
            return (
                <div className="app-root">
                    <TopBar />
                    <Login />
                </div>
            )
        }
    }
}

App.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    pushToken: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        pushToken: state.auth.pushToken
    }
}

module.exports = connect(mapStateToProps)(App)