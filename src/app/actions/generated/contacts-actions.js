const ContactsActionsTypes = require('../types/contacts-action-types')
const {ActionStatus} = require('../../constants')
const ResourceUtil = require('../../util/resource-util')

function setState(contacts) {
    return {
        type: ContactsActionsTypes.SET_STATE,
        contacts
    }
}

module.exports = {
    setState
}