import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Collapse from 'rc-collapse'
import 'rc-collapse/assets/index.css'

import * as IntegrationsService from '../../services/integrations-service'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import GmailIntegration from './GmailIntegration'
import GmailLogo from '../../static/GmailLogo.svg'
import SlackLogo from '../../static/SlackLogo.svg'
import TrelloLogo from '../../static/TrelloLogo.png'
import IntegratedIcon from '../../static/success-grey.png'

const Panel = Collapse.Panel

class IntegrationsBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, IntegrationsBox.prototype)
    }

    getHeader(title, logo, isIntegrated, {onClick, href}) {
        const {sheet: {classes}} = this.props

        function buttonClicked(event) {
            event.stopPropagation()
            onClick && onClick()
        }

        const status =
            <Flexbox name="status" container="row" alignItems="center" className={classes.integratedStatus}>
                <img src={IntegratedIcon} className={classes.integratedIcon} />
                Integrated
            </Flexbox>

        const action =
            <Flexbox name="action">
                {onClick && <button onClick={buttonClicked} className={classes.integrateButton}>Integrate Now</button>}
                {href && <a href={href} onClick={buttonClicked} className={classes.integrateButton}>Integrate Now</a>}
            </Flexbox>

        return (
            <div name="integration-header" className={classes.header}>
                <Flexbox name="row" container="row" alignItems="center">
                    <Flexbox name="logo">
                        <img src={logo} className={classes.logo} />
                    </Flexbox>
                    <Flexbox name="title" grow={1} shrink={0}>
                        <span className={classes.headerTitle}>{title}</span>
                    </Flexbox>
                    {isIntegrated ? status : action}
                </Flexbox>
            </div>
        )
    }

    getGmailHeader() {
        const {chromeExtension} = this.props
        return this.getHeader('Gmail', GmailLogo, chromeExtension.isInstalled, {onClick: IntegrationsService.instsallChromeExtension})
    }

    getSlackHeader() {
        const {currentUser} = this.props
        return this.getHeader('Slack', SlackLogo, currentUser.slack, {href: IntegrationsService.getSlackUrl()})
    }

    getTrelloHeader() {
        const {currentUser} = this.props
        return this.getHeader('Trello', TrelloLogo, currentUser.trello, {href: IntegrationsService.getTrelloUrl()})
    }

    render() {
        const {expand, sheet: {classes}} = this.props

        return (
            <Flexbox name="integrations-box-container" container="column" className={classes.container}>
                <Collapse accordion={true} defaultActiveKey={expand}>
                    <Panel header={this.getGmailHeader()} key="gmail" className={classes.headerWrapper}>
                        <GmailIntegration />
                    </Panel>
                    <Panel header={this.getSlackHeader()} key="slack" className={classes.headerWrapper}>Slack</Panel>
                    <Panel header={this.getTrelloHeader()} key="trello" className={classes.headerWrapper}>Trello</Panel>
                </Collapse>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        width: 550,
        minHeight: 450,
        backgroundColor: styleVars.secondaryBackgroundColor
    },
    headerWrapper: {
        width: '100%',
        backgroundColor: styleVars.secondaryBackgroundColor,
        '& .rc-collapse-header': {
            height: '50px !important',
            lineHeight: '50px !important'
        }
    },
    header: {
        display: 'inline-block',
        width: 'calc(100% - 28px)'
    },
    headerTitle: {
        color: 'black',
        fontSize: '1.143em',
        letterSpacing: '0.025em'
    },
    logo: {
        height: 15,
        width: 15,
        marginRight: 10
    },
    integrateButton: {
        display: 'block',
        height: 30,
        lineHeight: '30px',
        width: 144,
        backgroundColor: styleVars.highlightColor,
        color: 'black',
        textTransform: 'uppercase',
        textDecoration: 'none',
        letterSpacing: '0.025em',
        outline: 'none',
        border: 'none',
        marginRight: 35,
        cursor: 'pointer',
        '&:hover': {
            color: 'white'
        }
    },
    integratedStatus: {
        marginRight: 50,
        color: '#7f8b91'
    },
    integratedIcon: {
        height: 15,
        width: 15,
        marginRight: 5
    }
}

IntegrationsBox.propTypes = {
    currentUser: PropTypes.object.isRequired,
    chromeExtension: PropTypes.object.isRequired,
    expand: PropTypes.string
}


function mapStateToProps(state) {
    return {
        currentUser: state.userProfile,
        chromeExtension: state.chromeExtension
    }
}

export default useSheet(connect(mapStateToProps)(IntegrationsBox), style)