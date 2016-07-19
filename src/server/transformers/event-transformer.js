const EventTypes = require('../../common/enums/event-types')
const ThingTransformer = require('./thing-transformer')
const UserTransformer = require('./user-transformer')

function docToDto(event) {
    return {
        id: event.id,
        thing: event.thing && ThingTransformer.docToDto(event.thing),
        createdAt: event.createdAt,
        payload: event.payload,
        eventType: EventTypes[event.eventType],
        creator: event.creator && UserTransformer.docToDto(event.creator)
    }
}

module.exports = {docToDto}