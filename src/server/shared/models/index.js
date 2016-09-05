import thinky from './thinky'
import Thing from './Thing'
import User from './User'
import Event from './Event'
import MailNotification from './MailNotification'

// Relations must be done in a separate file, because there might be circular references between Models.
Thing.hasMany(Event, 'events', 'id', 'thingId')
Event.belongsTo(Thing, 'thing', 'thingId', 'id')

function uuid() {
    return thinky.r.uuid().run()
}

export {Thing, User, Event, MailNotification, uuid}

