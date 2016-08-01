const React = require('react')
const {Component, PropTypes} = React

const BaseActionBar = require('./BaseActionsBar')
const EventTypes = require('../../../common/enums/event-types')
const ThingStatus = require('../../../common/enums/thing-status')

class GithubActionBar extends Component {

    showDo() {
        const {thing, notification} = this.props
        return thing.payload.status === ThingStatus.NEW.key &&
            (notification ? notification.eventType.key === EventTypes.CREATED.key : true)
    }

    getAllowedActions() {
        return {
            doAction: this.showDo()
        }
    }

    render() {
        return (<BaseActionBar thing={this.props.thing} notification={this.props.notification}
                           allowedActions={this.getAllowedActions()} />)
    }
}

GithubActionBar.propTypes = {
    thing: PropTypes.object.isRequired,
    notification: PropTypes.object
}

module.exports = GithubActionBar
