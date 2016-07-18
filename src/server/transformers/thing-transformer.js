const ThingTypes = require('../../common/enums/thing-types')
const {pick} = require('lodash/core')

function docToDto(thing) {
    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: getPartialUser(thing.creator),
        to: getPartialUser(thing.to),
        body: thing.body,
        subject: thing.subject,
        payload: thing.payload,
        type: ThingTypes[thing.type]
    }
}

function getPartialUser(user) {
    return pick(user, ['id', 'firstName', 'lastName', 'email'])
}

module.exports = {docToDto}