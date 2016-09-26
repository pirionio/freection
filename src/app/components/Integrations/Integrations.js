import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import classAutobind from 'class-autobind'
import classNames from 'classnames'

import Flexbox from '../UI/Flexbox'
import Link from '../UI/Link'
import styleVars from '../style-vars'

class Integrations extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Integrations.prototype)

        this.state = {
            hasExtension: false
        }
    }

    componentWillMount() {
        const {config} = this.props

        // This is the way to communicate with the Chrome Extension.
        // It is risky, since we accept messages from outside, so we accept only messages from our same origin.
        window.addEventListener('message', event => {
            if (event.origin === config.baseUrl) {
                this.setState({hasExtension: true})
            }
        }, false)
    }

    installChromeExtension() {
        if (!this.isChromeExtensionInstalled()) {
            chrome.webstore.install()
        }
    }

    isChromeExtensionInstalled() {
        return this.state.hasExtension
    }

    getGmailLink() {
        const {sheet: {classes}} = this.props

        if (!this.isChromeExtensionInstalled()) {
            return (
                <Flexbox name="chrome-extension" className={classes.extension}>
                    <span className={classes.title}>
                        You can also try our Chrome extension, in order to use Freection for managing your emails:
                    </span>
                    <button type="button" className={classes.gmailLink} onClick={this.installChromeExtension}
                            disabled={this.isChromeExtensionInstalled()}>
                        <Icon name="envelope" className={classes.icon} />
                        Gmail
                    </button>
                </Flexbox>
            )
        }

        return (
            <Flexbox name="chrome-extension" className={classes.extension}>
                <span className={classes.title}>
                    <Icon name="envelope" className={classes.icon} />
                    You're already using our Chrome extension for Gmail, that's great!
                </span>
            </Flexbox>
        )
    }

    render() {
        const {sheet: {classes}} = this.props

        const gmailLink = this.getGmailLink()

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
                {gmailLink}
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

Integrations.propTypes = {
    config: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

export default useSheet(connect(mapStateToProps)(Integrations), style)
