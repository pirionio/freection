import {_fetchWhatsNew} from './generated/whats-new-actions'
const {InvalidationStatus} = require('../constants')

export const fetchWhatsNew = () => {
    return (dispatch, getState) => {
        const {whatsNew} = getState()
        if (whatsNew.invalidationStatus === InvalidationStatus.INVALIDATED ||
            whatsNew.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(_fetchWhatsNew())
        }
    }
}

export * from './generated/whats-new-actions'