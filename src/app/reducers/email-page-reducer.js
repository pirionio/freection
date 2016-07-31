const EmailPageActionTypes = require('../actions/types/email-page-action-types')
const {ActionStatus} = require('../constants')

const initialState = {
    thread: {},
    isFetching: false
}

function get(state, action) {
    switch (action.status) {
        case ActionStatus.START:
            return {
                thread: {},
                isFetching: true
            }
        case ActionStatus.COMPLETE:
            return {
                thread: action.thread,
                isFetching: false
            }
        case ActionStatus.ERROR:
        default:
            return initialState
    }
}

function hide(state, action) {
    switch (action.status) {
        default:
            return initialState
    }
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case EmailPageActionTypes.GET:
            return get(state, action)
        case EmailPageActionTypes.HIDE:
            return hide(state, action)
        default:
            return state
    }
}