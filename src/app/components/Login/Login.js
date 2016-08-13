const React = require('react')
const {Component} = React
const radium = require('radium')

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class Login extends Component {
    render() {
        const styles = {
            container: {
            },
            title: {
                marginTop: '50px',
                color: styleVars.primaryColor,
                fontSize: '1.7em'
            },
            login: {
                height: '40px',
                lineHeight: '40px',
                width: '220px',
                marginBottom: '120px',
                fontSize: '1.3em',
                backgroundColor: styleVars.highlightColor,
                color: styleVars.primaryColor,
                textDecoration: 'none',
                textAlign: 'center',
                ':hover': {
                    color: 'white',
                    cursor: 'pointer'
                }
            }
        }

        return (
            <Flexbox name="login-container" grow={1} container="column" justifyContent="flex-start" alignItems="center" style={styles.container}>
                <Flexbox name="title" style={styles.title}>
                    <span>Fuck yeah, it's another mail client.</span>
                </Flexbox>
                <Flexbox name="login" grow={1} container="column" justifyContent="center" alignItems="center">
                    <a href="/login/google" style={styles.login}>Login with google</a>
                </Flexbox>
            </Flexbox>
        )
    }
}

module.exports = radium(Login)