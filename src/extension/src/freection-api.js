function getUser(options) {
    return fetch(options.baseUrl + '/api/general/user', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(response => response.json())
}

function getEmailThings(options) {
    return fetch(options.baseUrl + '/api/things/emailthings', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(response => response.json())
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

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            isHex: true,
            emailData: {
                threadId: threadId,
                subject: subject,
                recipients: contacts
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

module.exports = {
    getUser,
    getEmailThings,
    doEmail
}