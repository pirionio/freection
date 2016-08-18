const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const GithubActions = require('../../actions/github-actions')
const {InvalidationStatus} = require('../../constants')
const Repository = require('./Repository')

const Flexbox = require('../UI/Flexbox')
const Scrollable = require('../Scrollable/Scrollable')
const Icon = require('react-fontawesome')
const styleVars = require('../style-vars')

class Github extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Github.prototype)
    }

    componentDidMount() {
        this.props.dispatch(GithubActions.fetchGithub())
    }

    getFetching() {
        const styles = this.getStyles()
        return (
            <div style={styles.content}>
                Fetching github data
            </div>
        )
    }

    getNotActive() {
        const styles = this.getStyles()
        return (
            <Flexbox name="github-not-active" style={styles.notActive}>
                <span>You are not integrated with github yet, </span>
                <a href="/api/github/integrate" style={styles.link}>
                    integrate with github now
                </a>
                .
            </Flexbox>
        )
    }

    getActive() {
        const {repositories, clientId} = this.props
        const rows = repositories.map(repository => <Repository key={repository.fullName} repository={repository} />)

        const styles = this.getStyles()

        return (
            <Flexbox name="github-content" grow={1} container="column" style={styles.content}>
                <Flexbox name="github-header" style={styles.content.header}>
                    <Flexbox>
                        Pick the repositories you would like to get notifications for.
                    </Flexbox>
                    <Flexbox style={styles.explanation}>
                        <span>If you don't find the repository, make sure you grant access to Freection at </span>
                        <a href={`https://github.com/settings/connections/applications/${clientId}`} target="_blank" style={styles.explanation}>
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

    getStyles() {
        return {
            container: {
                color: 'black',
                fontSize: '1.2em'
            },
            title: {
                fontSize: '1.3em',
                marginBottom: '20px',
                icon: {
                    marginRight: '10px'
                }
            },
            content: {
                header: {
                    marginBottom: '20px'
                }
            },
            explanation: {
                marginTop: '8px',
                color: styleVars.watermarkColor,
                fontSize: '0.9em'
            }
        }
    }

    render() {
        const {fetched, active} = this.props

        const content =
            !fetched ? this.getFetching() :
            !active ? this.getNotActive() :
            this.getActive()

        const styles = this.getStyles()

        return (
            <Flexbox name="github-container" grow={1} container="column" style={styles.container}>
                <Flexbox style={styles.title}>
                    <Icon name="github" style={styles.title.icon} />
                    Github Integration
                </Flexbox>
                {content}
            </Flexbox>
        )
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

module.exports = connect(mapStateToProps)(Github)