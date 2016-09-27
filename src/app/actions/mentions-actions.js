import {_fetchMentions} from './generated/mentions-actions'
import {InvalidationStatus} from '../constants'

export const fetchMentions = () => {
    return (dispatch, getState) => {
        const {mentions} = getState()
        if (mentions.invalidationStatus === InvalidationStatus.INVALIDATED ||
            mentions.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(_fetchMentions())
        }
    }
}

export * from './generated/mentions-actions'