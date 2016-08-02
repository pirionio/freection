const React = require('react')
const {Component, PropTypes} = React

const EntityTypes = require('../../../common/enums/entity-types')
const ThingActionsBar = require('./ThingActionsBar')
const GithubActionBar = require('./GithubActionBar')
const EmailActionBar = require('./EmailActionBar')

class ActionsBar extends Component {
    render() {
        const {thing, notification, ping, cancel} = this.props

        switch (thing.type.key) {
            case EntityTypes.THING.key:
                return <ThingActionsBar thing={thing} notification={notification} ping={ping} cancel={cancel} />
            case EntityTypes.GITHUB.key:
                return <GithubActionBar thing={thing} notification={notification} />
            case EntityTypes.EMAIL.key:
                return <EmailActionBar thread={thing} notification={notification} />
            default:
                return <div></div>
        }
    }
}

ActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    notification: PropTypes.object,
    ping: PropTypes.bool,
    cancel: PropTypes.bool
}

ActionsBar.defaultProps = {
    ping: true,
    cancel: true
}

module.exports = ActionsBar
