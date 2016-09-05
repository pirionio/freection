import thinky from './thinky'

const type = thinky.type

const MailNotification = thinky.createModel('MailNotification', {
    id: type.string(),
    timestamp: type.date(),
    type: type.string()
})

export default MailNotification