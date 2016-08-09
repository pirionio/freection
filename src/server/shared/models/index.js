const thinky = require('./thinky')

const Thing = require('./Thing')
const User = require('./User')
const Event = require('./Event')
const MailNotification = require('./MailNotification')

// Relations must be done in a separate file, because there might be circular references between Models.
Thing.hasMany(Event, 'events', 'id', 'thingId')
Event.belongsTo(Thing, 'thing', 'thingId', 'id')

function uuid() {
    return thinky.r.uuid().run()
}

module.exports = {Thing, User, Event, MailNotification, uuid}

