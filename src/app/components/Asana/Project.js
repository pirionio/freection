import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import Delay from 'react-delay'

import * as AsanaActions from '../../actions/asana-actions'
import Flexbox from '../UI/Flexbox'

class Project extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Project.prototype)
    }

    toggleProject(id, checked) {
        if (checked !== this.props.project.enabled) {
            if (checked)
                this.props.dispatch(AsanaActions.enableProject(id))
            else
                this.props.dispatch(AsanaActions.disableProject(id))
        }
    }

    render() {
        const {project, sheet: {classes}} = this.props

        return (
            <Flexbox name="asana-project" container="row" alignItems="center" className={classes.project}>
                <label>
                    <input type="checkbox"
                           disabled={project.posting}
                           onChange={event => this.toggleProject(project.id, event.target.checked)}
                           checked={project.enabled}
                           className={classes.checkbox} />
                    {project.organization} - {project.team}\{project.name}
                </label>
                {
                    project.posting ?
                        <Delay wait={150}>
                            <Icon name="spinner" pulse className={classes.icon} />
                        </Delay>
                        : null
                }
            </Flexbox>
        )
    }
}

const style = {
    project: {
        marginBottom: 10
    },
    checkbox: {
        marginRight: 5
    },
    icon: {
        marginLeft: 10
    }
}

Project.propTypes = {
    project: PropTypes.object
}

export default useSheet(connect()(Project), style)