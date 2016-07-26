const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const TopBar = require('../TopBar/TopBar')
const SideBar = require('../SideBar/SideBar')
const Login = require('../Login/Login')
const PushService = require('../../services/push-service')

class App extends Component {
    componentDidMount() {
        const {currentUser, dispatch} = this.props
        if (currentUser.isAuthenticated) {
            PushService.listenToUpdates(currentUser.pushToken, dispatch)
        }
    }

    render () {
        const {currentUser} = this.props

        if (currentUser.isAuthenticated) {
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
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(App)