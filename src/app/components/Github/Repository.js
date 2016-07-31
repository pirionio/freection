const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const GithubActions = require('../../actions/github-actions')

class Repository extends Component {

    constructor(props) {
        super(props)
    }

    toggleRepository(id, checked) {
        if (checked != this.props.repository.enabled) {
            if (checked)
                this.props.dispatch(GithubActions.enableRepository(id))
            else
                this.props.dispatch(GithubActions.disableRepository(id))
        }
    }

    render() {
        const {repository} = this.props

        return (
            <div>
                <label>
                    <input type="checkbox" disabled={repository.posting}
                           onChange={event => this.toggleRepository(repository.id, event.target.checked)} checked={repository.enabled} />{repository.fullName}
                </label>
                {repository.posting ? 'In progress' : null}
            </div>)
    }
}

Repository.propTypes = {
    repository: PropTypes.object
}

module.exports = connect()(Repository)