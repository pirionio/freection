const uniq = require('lodash/uniq')
const flatten = require('lodash/flatten')

function threadRowToDto(threadRowView) {
    return {
        threadId: threadRowView.getThreadID(),
        subject: threadRowView.getSubject(),
        contacts: threadRowView.getContacts()
    }
}

function threadViewToDto(threadView) {
    return {
        threadId: threadView.getThreadID(),
        subject: threadView.getSubject(),
        contacts: accumulateThreadContacts(threadView)
    }
}

function accumulateThreadContacts(threadView) {
    return uniq(flatten(threadView.getMessageViewsAll().map(messageView => {
        return [messageView.getSender(), ...messageView.getRecipients()]
    })))
}

module.exports = {
    threadRowToDto,
    threadViewToDto
}