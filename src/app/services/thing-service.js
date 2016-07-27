const ResourceUtil = require('../util/resource-util')
const EventTypes = require('../../common/enums/event-types')

function discardComments(notification) {
    return ResourceUtil.post(`/api/things/${notification.thing.id}/discard/${EventTypes.COMMENT.key}`)
}

function discardPing(notification) {
    return ResourceUtil.post(`/api/events/${notification.id}/discard`)
}

module.exports = {discardComments, discardPing}
