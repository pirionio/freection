import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'
import Delay from 'react-delay'

import * as GithubActions from '../../actions/github-actions'
import Flexbox from '../UI/Flexbox'

class Repository extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Repository.prototype)
    }

    toggleRepository(fullName, checked) {
        if (checked !== this.props.repository.enabled) {
            if (checked)
                this.props.dispatch(GithubActions.enableRepository(fullName))
            else
                this.props.dispatch(GithubActions.disableRepository(fullName))
        }
    }

    render() {
        const {repository, sheet: {classes}} = this.props

        return (
            <Flexbox name="github-repository" container="row" alignItems="center" className={classes.repository}>
                <label>
                    <input type="checkbox"
                           disabled={repository.posting}
                           onChange={event => this.toggleRepository(repository.fullName, event.target.checked)}
                           checked={repository.enabled}
                           className={classes.checkbox} />
                    {repository.fullName}
                </label>
                {
                    repository.posting ?
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
    repository: {
        marginBottom: 10
    },
    checkbox: {
        marginRight: 5
    },
    icon: {
        marginLeft: 10
    }
}

Repository.propTypes = {
    repository: PropTypes.object
}

export default useSheet(connect()(Repository), style)