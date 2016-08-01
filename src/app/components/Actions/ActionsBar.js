const React = require('react')
const {Component, PropTypes} = React

const EntityTypes = require('../../../common/enums/entity-types')
const ThingActionBar = require('./ThingActionBar')
const GithubActionBar = require('./GithubActionBar')

class ActionsBar extends Component {
    render() {
        const {thing, notification, ping, cancel} = this.props

        switch (thing.type.key) {
            case EntityTypes.THING.key:
                return <ThingActionBar thing={thing} notification={notification} ping={ping} cancel={cancel} />
            case EntityTypes.GITHUB.key:
                return <GithubActionBar thing={thing} notification={notification} />
            default:
                throw "UnknownEntityType"
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
