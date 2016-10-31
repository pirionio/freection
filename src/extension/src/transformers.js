const uniqBy = require('lodash/uniqBy')
const flatten = require('lodash/flatten')

function threadRowToDto(threadRowView, {sdk} = {}) {
    return {
        threadId: threadRowView.getThreadID(),
        subject: threadRowView.getSubject(),
        contacts: threadRowView.getContacts()
    }
}

function threadViewToDto(threadView, {sdk} = {}) {
    return {
        threadId: threadView.getThreadID(),
        subject: threadView.getSubject(),
        contacts: accumulateThreadContacts(sdk, threadView)
    }
}

function accumulateThreadContacts(sdk, threadView) {
    // For each message in the thread, get all of its recipients.
    // We get an array of arrays, which we then flatten to a list of many recipients.
    const allRecipients = flatten(threadView.getMessageViewsAll().map(messageView => {
        if (!messageView.isLoaded() || messageView.getViewState() !== sdk.Conversations.MessageViewViewStates.EXPANDED) {
            return []
        }
        return [messageView.getSender(), ...messageView.getRecipients()]
    }))

    // The recipients might overlap, so we want them unique, and we also filter out those that have no name or email address for some reason.
    return uniqBy(allRecipients.filter(recipient => !!recipient.emailAddress && !!recipient.name), 'emailAddress')
}

module.exports = {
    threadRowToDto,
    threadViewToDto
}