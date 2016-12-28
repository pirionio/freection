import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import * as SlackActions from '../../actions/slack-actions'
import {InvalidationStatus} from '../../constants'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'

class SlackIntegration extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, SlackIntegration.prototype)
    }

    componentDidMount() {
        this.props.dispatch(SlackActions.fetch())
    }

    getFetching() {
        const {sheet: {classes}} = this.props

        return (
            <div className={classes.fetching}>
                <Loader />
            </div>
        )
    }

    getAppNotInstalled() {
        return (
            <div>
                <div>You need to install the Freection app for your Slack team.</div>
                <div>
                    <span>Click </span>
                    <a href="/api/slack/addapp">here</a>
                    <span> to install it.</span>
                </div>
                <div>Then you could type <b>/freection</b> in Slack to send tasks to the team and to yourself!</div>
            </div>
        )
    }

    getExplanation() {
        return (
            <div>Type <b>/freection</b> to send tasks to others, or to yourself.</div>
        )
    }

    render() {
        const {fetched, active, appInstalled, sheet: {classes}} = this.props

        const content =
            !fetched ? this.getFetching() :
            !active ? this.getExplanation() :
            !appInstalled ? this.getAppNotInstalled() :
            this.getExplanation()

        return (
            <Flexbox name="slack-integration-container" container="column" className={classes.container}>
                {content}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        color: 'black',
        fontSize: '0.857em',
        lineHeight: 2
    },
    fetching: {
        position: 'relative',
        height: 80,
        '& .js-loader': {
            bottom: 0
        }
    }
}

SlackIntegration.propTypes = {
    active: PropTypes.bool.isRequired,
    appInstalled: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        active: state.slack.active,
        appInstalled: state.slack.appInstalled,
        fetched: state.slack.invalidationStatus === InvalidationStatus.FETCHED
    }
}

export default useSheet(connect(mapStateToProps)(SlackIntegration), style)