import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import * as AsanaActions from '../../actions/asana-actions'
import {InvalidationStatus} from '../../constants'
import Project from './Project'
import Loader from '../UI/Loader'
import Flexbox from '../UI/Flexbox'
import Scrollable from '../Scrollable/Scrollable'
import AsanaLogoBlack from '../../static/AsanaLogoBlack.png'

class Asana extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Asana.prototype)
    }

    componentDidMount() {
        this.props.dispatch(AsanaActions.fetchAsana())
    }

    getFetching() {
        return (
            <Loader />
        )
    }

    getNotActive() {
        return (
            <Flexbox name="asana-not-active">
                <span>You are not integrated with asana yet, </span>
                <a href="/api/asana/integrate">
                    integrate with asana now
                </a>
                .
            </Flexbox>
        )
    }

    getActive() {
        const {projects, sheet: {classes}} = this.props
        const rows = projects.map(project => <Project key={project.id} project={project} />)

        return (
            <Flexbox name="asana-content" grow={1} container="column">
                <Flexbox name="asana-header" className={classes.contentHeader}>
                    <Flexbox>
                        Pick the projects you would like to get notifications for.
                    </Flexbox>
                </Flexbox>
                <Flexbox name="asana-project-list" grow={1} container="column">
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
            <Flexbox name="asana-container" grow={1} container="column" className={classes.container}>
                <Flexbox className={classes.title}>
                    <img src={AsanaLogoBlack} className={classes.logo} />
                    Asana Integration
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
    logo: {
        marginRight: 10,
        width:19,
        height:18
    },
    contentHeader: {
        marginBottom: 20
    }
}

Asana.propTypes = {
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

export default useSheet(connect(mapStateToProps)(Asana), style)