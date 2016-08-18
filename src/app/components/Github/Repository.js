const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const GithubActions = require('../../actions/github-actions')

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
        const {repository} = this.props

        return (
            <Flexbox name="github-repository" container="row" alignItems="center" style={{marginBottom: '10px'}}>
                <label>
                    <input type="checkbox"
                           disabled={repository.posting}
                           onChange={event => this.toggleRepository(repository.fullName, event.target.checked)}
                           checked={repository.enabled}
                           style={{marginRight: '5px'}} />
                    {repository.fullName}
                </label>
                {
                    repository.posting ?
                        <Delay wait={150}>
                            <Icon name="spinner" pulse style={{marginLeft: '10px'}} />
                        </Delay>
                        : null
                }
            </Flexbox>
        )
    }
}

Repository.propTypes = {
    repository: PropTypes.object
}

module.exports = connect()(Repository)