import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import * as GithubActions from '../../actions/github-actions'
import {InvalidationStatus} from '../../constants'
import Repository from '../Github/Repository'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import Scrollable from '../Scrollable/Scrollable'
import styleVars from '../style-vars'

class GithubIntegration extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, GithubIntegration.prototype)
    }

    componentDidMount() {
        this.props.dispatch(GithubActions.fetchGithub())
    }

    getFetching() {
        const {sheet: {classes}} = this.props

        return (
            <div className={classes.fetching}>
                <Loader />
            </div>
        )
    }

    getNotActive() {
        return (
            <Flexbox container="column">
                <div>Every Github issue you're assigned to will appear in your Inbox.</div>
                <div>You can then decide what to add to your To Do and Follow Up boards.</div>
            </Flexbox>
        )
    }

    getActive() {
        const {repositories, clientId, sheet: {classes}} = this.props
        const rows = repositories.map(repository => <Repository key={repository.fullName} repository={repository} />)

        return (
            <Flexbox name="github-content" grow={1} container="column">
                <Flexbox name="github-header" className={classes.title}>
                    Repositories
                </Flexbox>
                <Flexbox name="github-explanation" container="column" className={classes.explanation}>
                    <div>Select the repositories you want to get notifications for.</div>
                    <div>
                        <span>If you don't find a repository, make sure you grant access to Freection at </span>
                        <a href={`https://github.com/settings/connections/applications/${clientId}`} target="_blank">Github settings</a>
                        <span>.</span>
                    </div>
                </Flexbox>
                <Flexbox name="github-repositories-list" grow={1} container="column">
                    {rows}
                </Flexbox>
            </Flexbox>
        )
    }

    render() {
        const {fetched, active, sheet: {classes}} = this.props

        const content =
            !fetched ? this.getFetching() :
            !active ? this.getNotActive() :
            this.getActive()

        return (
            <Flexbox name="github-integration-container" grow={1} container="column" className={classes.container}>
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
    title: {
        marginBottom: 20,
        fontWeight: 'bold'
    },
    explanation: {
        marginBottom: 20,
        color: styleVars.watermarkColor
    },
    fetching: {
        position: 'relative',
        height: 180
    }
}

GithubIntegration.propTypes = {
    active: PropTypes.bool.isRequired,
    repositories: PropTypes.array,
    fetched: PropTypes.bool.isRequired,
    clientId: PropTypes.string
}

function mapStateToProps(state) {
    return {
        active: state.github.active,
        repositories: state.github.repositories,
        fetched: state.github.invalidationStatus === InvalidationStatus.FETCHED,
        clientId: state.github.clientID
    }
}

export default useSheet(connect(mapStateToProps)(GithubIntegration), style)