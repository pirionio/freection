import {_fetchAllThings} from './generated/all-things-actions'
import {InvalidationStatus} from '../constants'

export const fetchAllThings = () => {
    return (dispatch, getState) => {
        const {allThings} = getState()
        if (allThings.invalidationStatus === InvalidationStatus.INVALIDATED ||
            allThings.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(_fetchAllThings())
        }
    }
}

export * from './generated/all-things-actions'