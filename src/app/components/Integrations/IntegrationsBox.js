import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Collapse from 'rc-collapse'
import 'rc-collapse/assets/index.css'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import GmailIntegration from './GmailIntegration'
import GmailLogo from '../../static/GmailLogo.svg'
import SlackLogo from '../../static/SlackLogo.svg'
import TrelloLogo from '../../static/TrelloLogo.png'

const Panel = Collapse.Panel

class IntegrationsBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, IntegrationsBox.prototype)
    }

    getIntegration(isExpanded) {
        if (isExpanded) {
            return (
                <Flexbox name="integration" container="column">

                </Flexbox>
            )
        }

        return (
            <Flexbox></Flexbox>
        )
    }

    getHeader(title, logo) {
        const {sheet: {classes}} = this.props

        return (
            <div name="integration-header" className={classes.header}>
                <Flexbox name="row" container="row" alignItems="center">
                    <Flexbox name="logo">
                        <img src={logo} className={classes.logo} />
                    </Flexbox>
                    <Flexbox name="title" grow={1} shrink={0}>
                        <span className={classes.headerTitle}>{title}</span>
                    </Flexbox>
                    <Flexbox name="status">
                        <button className={classes.integrateButton}>Integrate Now</button>
                    </Flexbox>
                </Flexbox>
            </div>
        )
    }

    getGmailHeader() {
        return this.getHeader('Gmail', GmailLogo)
    }

    getSlackHeader() {
        return this.getHeader('Slack', SlackLogo)
    }

    getTrelloHeader() {
        return this.getHeader('Trello', TrelloLogo)
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
        height: 30,
        lineHeight: '30px',
        width: 144,
        backgroundColor: styleVars.highlightColor,
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        outline: 'none',
        border: 'none',
        marginRight: 35
    }
}

IntegrationsBox.propTypes = {
    expand: PropTypes.string
}

export default useSheet(IntegrationsBox, style)