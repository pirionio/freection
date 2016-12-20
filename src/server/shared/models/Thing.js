import thinky from './thinky'

import EntityType from '../../../common/enums/entity-types'

const type = thinky.type

const Thing = thinky.createModel('Thing', {
    id: type.string(),
    createdAt: type.date().required(),
    creator: {
        id: type.string(),
        type: type.string().required(),
        displayName: type.string().required(),
        payload: type.object()
    },
    to: {
        id: type.string(),
        type: type.string().required(),
        displayName: type.string().required(),
        payload: type.object()
    },
    body: type.string(),
    subject: type.string().required(),
    doers: [type.string()],
    followUpers: [type.string()],
    mentioned: [type.string()],
    subscribers: [type.string()],
    all: [type.string()],
    payload: type.object(),
    type: type.string()
})

Thing.ensureIndex('followUpers', doc => {
    return doc('followUpers')
}, {multi: true})

Thing.ensureIndex('doers', doc => {
    return doc('doers')
}, {multi: true})

Thing.ensureIndex('mentioned', doc => {
    return doc('mentioned')
}, {multi: true})

Thing.ensureIndex('all', doc => {
    return doc('all')
}, {multi: true})

Thing.ensureIndex('externalId', doc => {
    return thinky.r.branch(doc('type').eq(EntityType.EXTERNAL.key), doc('payload')('id'), null)
})

Thing.ensureIndex('threadId', doc => {
    return doc('payload')('threadId')
})

Thing.ensureIndex('emailId', doc => {
    return doc('payload')('emailId')
})

export default Thing