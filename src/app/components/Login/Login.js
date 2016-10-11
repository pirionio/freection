import React, {Component} from 'react'
import Icon from 'react-fontawesome'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import Logo from '../../static/logo-white.png'

class Login extends Component {
    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="login-container" grow={1} container="column">
                <Flexbox name="top" grow={1} container="column" justifyContent="flex-start" alignItems="center" className={classes.top}>
                    <Flexbox name="title" className={classes.logo}>
                        <img src={Logo} className={classes.image} />
                    </Flexbox>
                    <Flexbox name="title" className={classes.title}>
                        <span>freection</span>
                    </Flexbox>
                    <Flexbox name="sub-title" container="column" alignItems="center" className={classes.subTitle}>
                        <span>Keep track of your work</span>
                        <span>And teammates work</span>
                        <span>Everywhere</span>
                        <span>Anytime</span>
                    </Flexbox>
                </Flexbox>
                <Flexbox name="bottom" container="row" justifyContent="center" alignItems="center" className={classes.bottom}>
                    <a href="/login/google" className={classes.login}>
                        <Flexbox container="row" justifyContent="center" alignItems="center">
                            <Icon name="google-plus" />
                            <span>Login with google</span>
                        </Flexbox>
                    </a>
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    top: {
        backgroundColor: styleVars.basePurpleColor,
        boxShadow: '0px 3px 21.6px 2.4px rgba(0, 0, 0, 0.15)',
        zIndex: 0
    },
    logo: {
        marginTop: 128
    },
    image: {
        width: 62,
        height: 18
    },
    title: {
        marginTop: 15,
        color: 'white',
        fontSize: '1.5em',
        letterSpacing: '0.1em'
    },
    subTitle: {
        marginTop: 200,
        color: 'white',
        fontSize: '2.357em',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'Roboto thin',
        '& span': {
            display: 'block',
            marginBottom: 10
        }
    },
    bottom: {
        height: 125,
        width: '100%',
        backgroundColor: styleVars.secondaryBackgroundColor
    },
    login: {
        height: 50,
        lineHeight: '50px',
        width: 250,
        backgroundColor: styleVars.highlightColor,
        color: styleVars.primaryColor,
        textDecoration: 'none',
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: '0.05em',
        '& .fa': {
            fontSize: '1.5em',
            marginRight: 18
        },
        '&:hover': {
            color: 'white',
            cursor: 'pointer'
        }
    }
}

export default useSheet(Login, style)
