const UserTransformer = require('./user-transformer')
const ThingTypes = require('../../common/enums/thing-types')

function docToDto(thing) {
    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: thing.creator && UserTransformer.docToDto(thing.creator),
        to: thing.to && UserTransformer.docToDto(thing.to),
        body: thing.body,
        subject: thing.subject,
        payload: thing.payload,
        type: ThingTypes[thing.type]
    }
}

module.exports = {docToDto}