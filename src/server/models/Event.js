const thinky = require('./thinky')
const type = thinky.type
const Thing = require('./Thing')

const Event = thinky.createModel('Event', {
    id: type.string(),
    thingId: type.string().required(),
    type: type.string().required(),
    createdAt: type.date().required(),
    payload: type.object(),
    readList: [{
        userId: type.string().required(),
        isRead: type.boolean().required(),
        readAt: type.date()
    }]
})

Event.belongsTo(Thing, 'thing', 'thingId', 'id')

const events = {
    CREATED: 'CREATED'
}

Event.events = events

Event.ensureIndex('whatsnew', function(doc) {
        return doc('readList').filter({isRead:false}).map(function(r) {
            return r('userId')
        })
    }, {multi:true})

Event.defineStatic('getWhatsNew', function(user) {
    return this.getAll(user, {index: 'whatsnew'}).getJoin({thing:{
        creator:true, to:true}}).run()
    })

module.exports = Event
