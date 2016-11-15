import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'

class Gmail extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Gmail.prototype)
    }

    isChromeExtensionInstalled() {
        return this.props.chromeExtension.isInstalled
    }

    installChromeExtension() {
        if (!this.isChromeExtensionInstalled()) {
            chrome.webstore.install()
        }
    }

    getChromeExtension() {
        const {sheet: {classes}} = this.props

        if (this.isChromeExtensionInstalled()) {
            return (
                <Flexbox name="chrome-extension">
                    <div>You're already using our Chrome extension for Gmail, that's great!</div>
                </Flexbox>
             )
        }

        return (
            <Flexbox name="chrome-extension">
                <span>Try our Chrome extension </span>
                <button type="button" className={classes.extensionLink} onClick={this.installChromeExtension}>here</button>
                 <span> in order to use Freection for managing your emails.</span>
            </Flexbox>
        )
    }

    getGmailPermissions() {
        const {currentUser, sheet: {classes}} = this.props

        if (currentUser.allowSendGmail) {
            return (
                <Flexbox name="gmail-permissions" container="column" className={classes.permissions}>
                    <div className={classes.permissionsTitle}>Permissions:</div>
                    <div>
                        <Icon name="check" className={classes.icon} />
                        <span>Sending emails from your Gmail account</span>
                        <a href={`/api/google/sendpermission?permission=${false}`} className={classes.permissionLink}>Deny</a>
                    </div>
                </Flexbox>
            )
        }

        return (
            <Flexbox name="gmail-permissions" container="column" className={classes.permissions}>
                <div className={classes.permissionsTitle}>Permissions:</div>
                <div>
                    <Icon name="times" className={classes.icon} />
                    <span>Sending emails from your Gmail account</span>
                    <a href={`/api/google/sendpermission?permission=${true}`} className={classes.permissionLink}>Allow</a>
                </div>
            </Flexbox>
        )
    }
    
    render() {
        const {sheet: {classes}} = this.props

        const extension = this.getChromeExtension()
        const permissions = this.getGmailPermissions()

        return (
            <Flexbox name="slack-container" grow={1} container="column" className={classes.container}>
                <Flexbox className={classes.title}>
                    <Icon name="envelope" className={classes.icon} />
                    Gmail Integration
                </Flexbox>
                {extension}
                {permissions}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        color: 'black',
        fontSize: '1.2em'
    },
    title: {
        fontSize: '1.3em',
        marginBottom: 20
    },
    icon: {
        marginRight: 10
    },
    extensionLink: {
        color: 'black',
        margin: [15, 0, 0],
        padding: 0,
        textDecoration: 'underline',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        outline: 'none'
    },
    permissions: {
        marginTop: 30
    },
    permissionsTitle: {
        fontSize: '1.143em',
        textDecoration: 'underline',
        marginBottom: 15
    },
    permissionLink: {
        margin: [0, 0, 0, 20],
        border: `1px solid ${styleVars.secondaryColor}`,
        backgroundColor: styleVars.secondaryBackgroundColor,
        color: 'black',
        textTransform: 'uppercase',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '0.75em',
        height: 27,
        padding: [8, 16],
        cursor: 'hand',
        '&:focus':{
            outline: 'none'
        },
        '&:hover': {
            backgroundColor: styleVars.secondaryColor,
            color: 'white'
        }
    }
}

Gmail.propTypes = {
    currentUser: PropTypes.object.isRequired,
    chromeExtension: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth,
        chromeExtension: state.chromeExtension
    }
}

export default useSheet(connect(mapStateToProps)(Gmail), style)