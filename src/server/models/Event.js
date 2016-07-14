const thinky = require('./thinky')
const type = thinky.type
const Thing = require('./Thing')

const Event = thinky.createModel('Event', {
    id: type.string(),
    thingId: type.string().required(),
    type: type.string().required(),
    createdAt: type.date().required(),
    payload: type.object(),
    readList: [type.string()]
})

Event.belongsTo(Thing, 'thing', 'thingId', 'id')

Event.ensureIndex('whatsnew', function(doc) {
    return doc('readList')
}, {multi:true})

Event.defineStatic('getWhatsNew', function(userId) {
    return this.getAll(userId, {index: 'whatsnew'}).
        getJoin({thing: {creator: true, to: true}}).
        run()
    })

module.exports = Event
