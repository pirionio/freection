const thinky = require('./thinky')

const Thing = require('./Thing')
const User = require('./User')
const Event = require('./Event')

// Relations must be done in a separate file, because there might be circular references between Models.
Thing.belongsTo(User, 'creator', 'creatorUserId', 'id')
Thing.belongsTo(User, 'to', 'toUserId', 'id')
Thing.hasMany(Event, 'events', 'id', 'thingId')

Event.belongsTo(Thing, 'thing', 'thingId', 'id')
Event.belongsTo(User, 'creator', 'creatorUserId', 'id')

function uuid() {
    return thinky.r.uuid().run()
}

module.exports = {Thing, User, Event, uuid}

