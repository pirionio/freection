const WhatsNewActions = require('./generated/whats-new-actions')
const {InvalidationStatus} = require('../constants')

const fetchWhatsNewActions = WhatsNewActions.fetchWhatsNew

const fetchWhatsNew = () => {
    return (dispatch, getState) => {
        const {whatsNew} = getState()
        if (whatsNew.invalidationStatus === InvalidationStatus.INVALIDATED) {
            dispatch(fetchWhatsNewActions())
        }
    }
}

module.exports = WhatsNewActions
module.exports.fetchWhatsNew = fetchWhatsNew