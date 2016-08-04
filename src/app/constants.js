const ActionStatus = {
    START: 'START',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR'
}

const GeneralConstants = {
    FETCHING_DELAY_MILLIS: 1000,
    ONGOING_ACTION_DELAY_MILLIS: 500
}

const InvalidationStatus = {
    INVALIDATED: 'INVALIDATED',
    FETCHING: 'FETCHING',
    FETCHED: 'FETCHED'
}

module.exports = {ActionStatus, GeneralConstants, InvalidationStatus}