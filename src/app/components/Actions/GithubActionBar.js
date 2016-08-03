// const React = require('react')
// const {Component, PropTypes} = React
//
// const EventTypes = require('../../../common/enums/event-types')
// const ThingStatus = require('../../../common/enums/thing-status')
//
// class GithubActionBar extends Component {
//
//     showDo() {
//         const {thing, notification} = this.props
//         return thing.payload.status === ThingStatus.NEW.key &&
//             (notification ? notification.eventType.key === EventTypes.CREATED.key : true)
//     }
//
//     showDismiss() {
//         const {thing, notification} = this.props
//         return [ThingStatus.NEW.key, ThingStatus.INPROGRESS.key].includes(thing.payload.status) &&
//             (notification ? notification.eventType.key === EventTypes.CREATED.key : true)
//     }
//
//     showClose() {
//         const {thing, notification} = this.props
//         return thing.payload.status === ThingStatus.DONE.key &&
//             (notification ? notification.eventType.key === EventTypes.DONE.key : true)
//     }
//
//     getAllowedActions() {
//         return {
//             doAction: this.showDo(),
//             dismiss: this.showDismiss(),
//             close: this.showClose()
//         }
//     }
//
//     render() {
//         return (<BaseActionBar thing={this.props.thing} notification={this.props.notification}
//                            allowedActions={this.getAllowedActions()} />)
//     }
// }
//
// GithubActionBar.propTypes = {
//     thing: PropTypes.object.isRequired,
//     notification: PropTypes.object
// }
//
// module.exports = GithubActionBar
