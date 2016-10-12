const ResourceUtil = require('../../app/util/resource-util')

function getUser(options) {
    return ResourceUtil.get(options.baseUrl + '/api/general/user')
}

function getEmailThings(options) {
    return ResourceUtil.get(options.baseUrl + '/api/things/emailthings')
}

function doEmail(options, threadData) {
    return createThing(options, threadData)
}

function createThing(options, threadData) {
    // Notice that the threadId here is in hex.
    // The API of Freection needs to be notified about it, because it essentially works with IMAP which expects decimal values.
    const url = options.baseUrl + '/api/emailthing'

    return ResourceUtil.post(url, {
        isHex: true,
        emailData: {
            threadId: threadData.threadId,
            subject: threadData.subject,
            recipients: threadData.contacts
        }
    })
}

module.exports = {
    getUser,
    getEmailThings,
    doEmail
}