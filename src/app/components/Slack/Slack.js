import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import * as SlackActions from '../../actions/slack-actions'
import {InvalidationStatus} from '../../constants'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'

class Slack extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Slack.prototype)
    }

    componentDidMount() {
        this.props.dispatch(SlackActions.fetch())
    }

    getFetching() {
        return <Loader />
    }

    getNotActive() {
        return (
            <Flexbox name="slack-not-active">
                <span>You are not integrated with slack yet, </span>
                <a href="/api/slack/integrate">
                    integrate with slack now
                </a>
                .
            </Flexbox>
        )
    }

    getAppNotInstalled() {
        return (
            <Flexbox name="slack-app-installed">
                <span>You need to install the app, </span>
                <a href="/api/slack/addapp">
                    install the app now
                </a>
                .
            </Flexbox>
        )
    }

    getActive() {
        return (
            <Flexbox name="slack-active">
                <div>Slack is integrated.</div>
                <div>You can type <strong>/thing</strong> in slack to send other users things.</div>
            </Flexbox>
        )
    }

    render() {
        const {fetched, active, appInstalled, sheet: {classes}} = this.props

        const content =
            !fetched ? this.getFetching() :
            !active ? this.getNotActive() :
            !appInstalled ? this.getAppNotInstalled() :
            this.getActive()

        return (
            <Flexbox name="slack-container" grow={1} container="column" className={classes.container}>
                <Flexbox className={classes.title}>
                    <Icon name="slack" className={classes.icon} />
                    Slack Integration
                </Flexbox>
                {content}
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
    contentHeader: {
        marginBottom: 20
    },
    explanation: {
        marginTop: 8,
        color: styleVars.watermarkColor,
        fontSize: '0.9em'
    }
}

Slack.propTypes = {
    active: PropTypes.bool.isRequired,
    appInstalled: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        active: state.slack.active,
        appInstalled: state.slack.appInstalled,
        fetched: state.slack.invalidationStatus === InvalidationStatus.FETCHED,

    }
}

export default useSheet(connect(mapStateToProps)(Slack), style)