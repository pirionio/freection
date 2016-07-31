const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')

const GithubActions = require('../../actions/github-actions')
const {InvalidationStatus} = require('../../constants')
const Repository = require('./Repository')

class Github extends Component {

    componentDidMount() {
        this.props.dispatch(GithubActions.fetchGithub())
    }

    render() {
        const {fetched, active, repositories, clientID} = this.props

        if (!fetched) {
            return (
                <div className="github-container">
                    <div className="github-content">Fetching github data
                    </div>
                </div>)
        }

        if (!active) {
            return (
                <div className="github-container">
                    <div className="github-content">
                        You are not integrated with github yet, <a href="/api/github/integrate">integrate with github
                        now</a>
                    </div>
                </div>)
        }

        const rows = repositories.map(repository => <Repository key={repository.id} repository={repository} />)

        return (
            <div className="github-container">
                <div className="github-content">
                    <div>
                        Pick the repositories you would like to get notification for. <br/>
                        If you don't find the repository make sure you grant access to freection at <a
                        href={`https://github.com/settings/connections/applications/${clientID}`} target="_blank">
                            Github settings
                        </a>
                    </div>

                    {rows}
                </div>
            </div>)
    }
}

Github.propTypes = {
    active: PropTypes.bool.isRequired,
    repositories: PropTypes.array,
    fetched: PropTypes.bool.isRequired,
    clientID: PropTypes.string
}

function mapStateToProps(state) {
    return {
        active: state.github.active,
        repositories: state.github.repositories,
        fetched: state.github.invalidationStatus === InvalidationStatus.FETCHED,
        clientID: state.github.clientID
    }
}

module.exports = connect(mapStateToProps)(Github)