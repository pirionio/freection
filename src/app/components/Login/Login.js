import React, {Component} from 'react'
import Icon from 'react-fontawesome'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'

class Login extends Component {
    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="login-container" grow={1} container="column" justifyContent="flex-start" alignItems="center">
                <Flexbox name="title" className={classes.title}>
                    <span>Fuck yeah, it's another mail client.</span>
                </Flexbox>
                <Flexbox name="login" grow={1} container="column" justifyContent="center" alignItems="center">
                    <a href="/login/google" className={classes.login}>
                        <Icon name="google-plus" /> <span>Login with google</span>
                    </a>
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    title: {
        marginTop: 50,
        color: styleVars.primaryColor,
        fontSize: '1.7em'
    },
    login: {
        height: 40,
        lineHeight: '40px',
        width: 220,
        marginBottom: 120,
        fontSize: '1.3em',
        backgroundColor: styleVars.highlightColor,
        color: styleVars.primaryColor,
        textDecoration: 'none',
        textAlign: 'center',
        '&:hover': {
            color: 'white',
            cursor: 'pointer'
        }
    }
}

export default useSheet(Login, style)
