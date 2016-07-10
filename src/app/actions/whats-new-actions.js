
const WhatsNewActionTypes = require('./types/whats-new-action-types')

exports.fetchWhatsNew = () => {
    console.log('fetchWhatsNew')
    return {
        type: WhatsNewActionTypes.FETCH_WHATS_NEW
    }
}