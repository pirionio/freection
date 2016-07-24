const EventTypes = require('../../../common/enums/event-types')
const ThingTransformer = require('./thing-transformer')
const UserTransformer = require('./user-transformer')
const CommentPayloadTransformer = require('./comment-payload-transformer')

function docToDto(event, user) {
    return {
        id: event.id,
        thing: event.thing && ThingTransformer.docToDto(event.thing),
        createdAt: event.createdAt,
        payload: event.eventType === EventTypes.COMMENT.key ?
            CommentPayloadTransformer.docToDto(event.payload, user) : event.payload,
        eventType: EventTypes[event.eventType],
        creator: event.creator && UserTransformer.docToDto(event.creator),
        showNew: event.showNewList.includes(user.id)
    }
}

module.exports = {docToDto}