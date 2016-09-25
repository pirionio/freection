import React, {Component} from 'react'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import classAutobind from 'class-autobind'

import Flexbox from '../UI/Flexbox'
import Link from '../UI/Link'

class Integrations extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Integrations.prototype)
    }

    installChromeExtension() {
        console.log('installChromeExtension')
        chrome.webstore.install('', () => {
            console.log('success')
        },
        error => {
            console.log('error:', error)
        })
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="integrations-container" grow={1} container="column">
                <span className={classes.title}>These are the integrations we offer right now:</span>
                <Link to="/integrations/github" className={classes.link}>
                    <Icon name="github" className={classes.icon} />
                    Github
                </Link>
                <Link to="/integrations/slack" className={classes.link}>
                    <Icon name="slack" className={classes.icon} />
                    Slack
                </Link>
                <Flexbox name="chrome-extension" className={classes.extension}>
                    <span className={classes.title}>
                        You can also try our Chrome extension, in order to use Freection for managing your emails:
                    </span>
                    <button type="button" className={classes.gmailLink} onClick={this.installChromeExtension}>
                        <Icon name="envelope" className={classes.icon} />
                        Gmail
                    </button>
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    title: {
        marginBottom: 15,
        color: 'black',
        fontSize: '1.4em'
    },
    link: {
        color: 'black',
        fontSize: '1.4em',
        marginBottom: 15
    },
    icon: {
        marginRight: 10
    },
    extension: {
        marginTop: 15
    },
    gmailLink: {
        color: 'black',
        fontSize: '1.4em',
        margin: [15, 0, 0],
        padding: 0,
        textDecoration: 'underline',
        display: 'block',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        outline: 'none'
    }
}

export default useSheet(Integrations, style)
