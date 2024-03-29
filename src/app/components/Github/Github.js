import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import * as GithubActions from '../../actions/github-actions'
import {InvalidationStatus} from '../../constants'
import Repository from './Repository'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import Scrollable from '../Scrollable/Scrollable'
import styleVars from '../style-vars'

class Github extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Github.prototype)
    }

    componentDidMount() {
        this.props.dispatch(GithubActions.fetchGithub())
    }

    getFetching() {
        return (
            <Loader />
        )
    }

    getNotActive() {
        return (
            <Flexbox name="github-not-active">
                <span>You are not integrated with github yet, </span>
                <a href="/api/github/integrate">
                    integrate with github now
                </a>
                .
            </Flexbox>
        )
    }

    getActive() {
        const {repositories, clientId, sheet: {classes}} = this.props
        const rows = repositories.map(repository => <Repository key={repository.fullName} repository={repository} />)

        return (
            <Flexbox name="github-content" grow={1} container="column">
                <Flexbox name="github-header" className={classes.contentHeader}>
                    <Flexbox>
                        Pick the repositories you would like to get notifications for.
                    </Flexbox>
                    <Flexbox className={classes.explanation}>
                        <span>If you don't find the repository, make sure you grant access to Freection at </span>
                        <a href={`https://github.com/settings/connections/applications/${clientId}`} target="_blank" className={classes.explanation}>
                            Github settings
                        </a>
                        .
                    </Flexbox>
                </Flexbox>
                <Flexbox name="github-repositories-list" grow={1} container="column">
                    <Scrollable>
                        {rows}
                    </Scrollable>
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
            <Flexbox name="github-container" grow={1} container="column" className={classes.container}>
                <Flexbox className={classes.title}>
                    <Icon name="github" className={classes.icon} />
                    Github Integration
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

Github.propTypes = {
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

export default useSheet(connect(mapStateToProps)(Github), style)