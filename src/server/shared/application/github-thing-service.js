const { Thing } = require('../models')
const EventCreator = require('./event-creator')
const ThingStatus = require('../../../common/enums/thing-status')
const EntityTypes = require('../../../common/enums/entity-types')
const EventTypes = require('../../../common/enums/event-types')

function newThing(creator, assigner, toUser, subject, body, id, number, url) {
    saveNewThing(creator, assigner, toUser, subject, body, id, number, url)
        .then(thing => {
            return EventCreator.createCreated(toUser, thing, getShowNewList)
        })
}

function saveNewThing(creator, assigner, to, subject, body, id, number, url) {
    const toUserId = to.id

    return Thing.save({
        createdAt: new Date(),
        creatorUserId: null,
        toUserId,
        body,
        subject,
        followUpers: [],
        doers: [],
        type: EntityTypes.GITHUB.key,
        payload: {
            status: ThingStatus.NEW.key,
            creator,
            assigner,
            id,
            number,
            url
        }
    })
}

function getShowNewList(user, thing, eventType) {

    switch (eventType) {
        case EventTypes.CREATED.key:
            return [thing.toUserId]
        default:
            throw "UnknownEventType"
    }
}

module.exports = {newThing}