const GoogleSmtpConnectionPool = require('../utils/smtp/google-smtp-connection-pool')
const EntityTypes = require('../../../common/enums/entity-types')
const ThingStatus = require('../../../common/enums/thing-status')
const {Thing} = require('../models')
const EventsCreator = require('./event-creator')
const {userToAddress} = require('./address-creator')

function sendEmail(user, to, subject, text, html) {
    return getConnection(user)
        .then(connection => {
            return connection.send(to, subject, text, html)
                .then(() => GoogleSmtpConnectionPool.releaseConnection(user, connection))
        })
}

function doEmail(user, thread) {
    const creator = thread.creator

    const comments = thread.messages.map(message => {
        return {
            html: message.payload.html,
            text: message.payload.text
        }
    })

    saveNewThing(thread.subject, creator, userToAddress(user), thread.payload.threadId).
        then(thing => {
            EventsCreator.createCreated(creator, thing, getShowNewList)
                .then(() => EventsCreator.createAccepted(userToAddress(user), thing, getShowNewList))
                .then(() => comments.map(
                    comment => EventsCreator.createComment(creator, thing, getShowNewList, comment.text, comment.html)))
                .then(all => Promise.all(all))

    })
}

function saveNewThing(subject, creator, to, threadId) {

    return Thing.save({
        createdAt: new Date(),
        creator,
        to,
        body: null,
        subject,
        followUpers: [],
        doers: [to.id],
        type: EntityTypes.EMAIL_THING.key,
        payload: {
            threadId,
            status: ThingStatus.INPROGRESS.key
        }
    })
}

function getShowNewList() {
    return []
}

function getConnection(user) {
    return GoogleSmtpConnectionPool.getConnection(user)
}

module.exports = {
    sendEmail, doEmail
}