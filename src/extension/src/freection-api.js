const ResourceUtil = require('../../app/util/resource-util')

function getUser(options) {
    return ResourceUtil.get(options.baseUrl + '/api/general/user')
}

function getEmailThings(options) {
    return ResourceUtil.get(options.baseUrl + '/api/things/emailthings')
}

function doEmail(options, threadRowView) {
    return createThing(options, threadRowView)
}

function createThing(options, threadRowView) {
    const threadId = threadRowView.getThreadID()
    const subject = threadRowView.getSubject()
    const contacts = threadRowView.getContacts()

    // Notice that the threadId here is in hex.
    // The API of Freection needs to be notified about it, because it essentially works with IMAP which expects decimal values.
    const url = options.baseUrl + '/emails/api/do'

    return ResourceUtil.post(url, {
        isHex: true,
        emailData: {
            threadId: threadId,
            subject: subject,
            recipients: contacts
        }
    })
}

module.exports = {
    getUser,
    getEmailThings,
    doEmail
}