import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import * as AsanaActions from '../../actions/asana-actions'
import {InvalidationStatus} from '../../constants'
import Project from '../Asana/Project'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import Scrollable from '../Scrollable/Scrollable'
import styleVars from '../style-vars'

class AsanaIntegration extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, AsanaIntegration.prototype)
    }

    componentDidMount() {
        this.props.dispatch(AsanaActions.fetchAsana())
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
                <div>Every Asana task you're assigned to will appear in your Inbox.</div>
                <div>You can then decide what to add to your To Do and Follow Up boards.</div>
            </Flexbox>
        )
    }

    getActive() {
        const {projects, sheet: {classes}} = this.props
        const rows = projects.map(project => <Project key={project.id} project={project} />)

        return (
            <Flexbox name="asana-content" grow={1} container="column">
                <Flexbox name="asana-header" className={classes.title}>
                    Projects
                </Flexbox>
                <Flexbox name="asana-explanation" className={classes.explanation}>
                    Select the project you want to get notifications for:
                </Flexbox>
                <Flexbox name="asana-project-list" grow={1} container="column">
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
            <Flexbox name="asana-container" grow={1} container="column" className={classes.container}>
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

AsanaIntegration.propTypes = {
    active: PropTypes.bool.isRequired,
    projects: PropTypes.array,
    fetched: PropTypes.bool.isRequired,
    clientId: PropTypes.string
}

function mapStateToProps(state) {
    return {
        active: state.asana.active,
        projects: state.asana.projects,
        fetched: state.asana.invalidationStatus === InvalidationStatus.FETCHED
    }
}

export default useSheet(connect(mapStateToProps)(AsanaIntegration), style)