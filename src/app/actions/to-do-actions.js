import {_fetchToDo} from './generated/to-do-actions'
import {InvalidationStatus} from '../constants'

export const fetchToDo = () => {
    return (dispatch, getState) => {
        const {toDo} = getState()
        if (toDo.invalidationStatus === InvalidationStatus.INVALIDATED ||
            toDo.invalidationStatus === InvalidationStatus.REQUIRE_UPDATE) {
            dispatch(_fetchToDo())
        }
    }
}

export * from './generated/to-do-actions'