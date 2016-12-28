import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import * as IntegrationsService from '../../services/integrations-service'

class GmailIntegration extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, GmailIntegration.prototype)
    }

    isChromeExtensionInstalled() {
        return this.props.chromeExtension.isInstalled
    }

    installChromeExtension() {
        if (!this.isChromeExtensionInstalled()) {
            IntegrationsService.instsallChromeExtension()
        }
    }

    getChromeExtension() {
        const {sheet: {classes}} = this.props

        const message = this.isChromeExtensionInstalled() ?
            <div>You're already using our Chrome extension, that's great!</div> :
            <div>
                <span>Click </span>
                <button type="button" className={classes.extensionLink} onClick={this.installChromeExtension}>here</button>
                <span> to install it.</span>
            </div>

        return (
            <Flexbox name="chrome-extension">
                <div>Our Chrome extension lets you add tasks to your To Do and Follow Up, directly from Gmail.</div>
                {message}
            </Flexbox>
        )
    }

    getGmailForward() {
        return (
            <Flexbox name="forward">
                <div>You can also forward emails to <b>forward@reply.freection.com</b> in order to add them as tasks in your To Do.</div>
            </Flexbox>
        )
    }

    getGmailPermissions() {
        const {currentUser, sheet: {classes}} = this.props

        const icon = currentUser.allowSendGmail ? 'check' : 'times'
        const button = currentUser.allowSendGmail ? 'Deny' : 'Allow'
        const value = currentUser.allowSendGmail ? false : true
        
        return (
            <Flexbox name="gmail-permissions" container="column">
                <Flexbox name="permission" container="row" alignItems="center" className={classes.permissionRow}>
                    <Icon name={icon} className={classes.icon} />
                    <Flexbox grow={1}>
                        Sending emails from your Gmail account
                    </Flexbox>
                    <a href={`/api/google/sendpermission?permission=${value}`} className={classes.permissionLink}>{button}</a>
                </Flexbox>
            </Flexbox>
        )
    }

    render() {
        const {sheet: {classes}} = this.props

        const extension = this.getChromeExtension()
        const forward = this.getGmailForward()
        const permissions = this.getGmailPermissions()

        return (
            <Flexbox name="gmail-integration-container" container="column" className={classes.container}>
                <Flexbox name="chrome-extension">
                    <div className={classes.title}>Chrome Extension</div>
                    {extension}
                </Flexbox>
                <Flexbox name="forward">
                    <div className={classes.title}>Forward</div>
                    {forward}
                </Flexbox>
                <Flexbox name="permissions">
                    <div className={classes.title}>Permissions</div>
                    {permissions}
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        color: 'black',
        fontSize: '0.857em',
        lineHeight: 2,
        '& > div:not(:first-of-type)': {
            marginTop: 10
        }
    },
    title: {
        marginBottom: 10,
        fontWeight: 'bold'
    },
    permissionRow: {
        height: 20,
        padding: [0, 20, 0, 5]
    },
    icon: {
        marginRight: 10
    },
    extensionLink: {
        color: 'black',
        padding: 0,
        textDecoration: 'underline',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        outline: 'none'
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
        height: 20,
        padding: [1, 12],
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

GmailIntegration.propTypes = {
    currentUser: PropTypes.object.isRequired,
    chromeExtension: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.userProfile,
        chromeExtension: state.chromeExtension
    }
}

export default useSheet(connect(mapStateToProps)(GmailIntegration), style)