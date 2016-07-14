const React = require('react')
const {Component} = React
const {connect} = require('react-redux')

class UserInfo extends Component {
    render() {
        const {isAuthenticated, firstName} = this.props

        if (isAuthenticated) {
            return (
                <span className="user-info">
                    Hello {firstName} | <a href="/login/logout" className="logout-link">Logout</a>
                </span>)
        } else {
            return null
        }
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        firstName: state.auth.firstName
    }
}

module.exports = connect(mapStateToProps)(UserInfo)
