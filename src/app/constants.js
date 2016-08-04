const ActionStatus = {
    START: 'START',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR'
}

const GeneralConstants = {
    ONGOING_ACTION_DELAY_MILLIS: 500
}

const InvalidationStatus = {
    INVALIDATED: 'INVALIDATED',
    FETCHING: 'FETCHING',
    FETCHED: 'FETCHED'
}

module.exports = {ActionStatus, GeneralConstants, InvalidationStatus}