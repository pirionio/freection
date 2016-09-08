import {_fetchFollowUps} from './generated/follow-up-actions'
import {InvalidationStatus} from '../constants'

export const fetchFollowUps = () => {
    return (dispatch, getState) => {
        const {followUps} = getState()
        if (followUps.invalidationStatus === InvalidationStatus.INVALIDATED ||
            followUps.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(_fetchFollowUps())
        }
    }
}

export * from './generated/follow-up-actions'