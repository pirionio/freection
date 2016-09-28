import MessageBoxActionTypes from '../actions/types/message-box-action-types'

const initialState = {
    opened: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case MessageBoxActionTypes.OPEN_EXPANDED:
            return {opened: true}
        case MessageBoxActionTypes.CLOSE_EXPANDED:
            return {opened: false}
        case MessageBoxActionTypes.MESSAGE_SENT:
            return {opened: false}
        case MessageBoxActionTypes.CLOSE_MESSAGE_BOX:
            return {opened: false}
        default:
            return state
    }
}