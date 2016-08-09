const thinky = require('./thinky')
const type = thinky.type

const MailNotification = thinky.createModel('MailNotification', {
    id: type.string(),
    timestamp: type.date(),
    payload: type.object()
})

module.exports = MailNotification