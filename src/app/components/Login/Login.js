const React = require('react')
const {Component} = React

class Login extends Component {
    render() {
        return (
            <div className="login-container">
                <div className="login-content">
                    <a href="/login/google">Login with google</a>
                </div>
            </div>)
    }
}

module.exports = Login