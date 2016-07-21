const UserTransformer = require('./user-transformer')
const ThingTypes = require('../../../common/enums/thing-types')
const CommentPayloadTransformer = require('./comment-payload-transformer')

function commentToDto(comment, user) {
    return Object.assign({}, comment, {
        payload: CommentPayloadTransformer.docToDto(comment.payload, user)
    })
}

function docToDto(thing, user) {
    return {
        id: thing.id,
        createdAt: thing.createdAt,
        creator: thing.creator && UserTransformer.docToDto(thing.creator),
        to: thing.to && UserTransformer.docToDto(thing.to),
        body: thing.body,
        subject: thing.subject,
        payload: thing.payload,
        type: ThingTypes[thing.type],
        comments: thing.events ? thing.events.map(comment => commentToDto(comment, user)) : []
    }
}

module.exports = {docToDto}