const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

import * as GithubActions from '../../actions/github-actions'

const Flexbox = require('../UI/Flexbox')
const Icon = require('react-fontawesome')
const Delay = require('react-delay')

class Repository extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Repository.prototype)
    }

    toggleRepository(fullName, checked) {
        if (checked != this.props.repository.enabled) {
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

module.exports = useSheet(connect()(Repository), style)