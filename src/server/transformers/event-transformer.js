const EventTypes = require('../../common/enums/event-types')
const ThingTransformer = require('./thing-transformer')

function docToDto(event) {
    return {
        id: event.id,
        thing: ThingTransformer.docToDto(event.thing),
        createdAt: event.createdAt,
        payload: event.payload,
        eventType: EventTypes[event.eventType]
    }
}

module.exports = {docToDto}