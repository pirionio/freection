const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const TopBar = require('../TopBar/TopBar')
const SideBar = require('../SideBar/SideBar')
const Login = require('../Login/Login')

class App extends Component {
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
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

module.exports = connect(mapStateToProps)(App)