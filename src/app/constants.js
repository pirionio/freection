const ActionStatus = {
    START: 'START',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR'
}

const GeneralConstants = {
    FETCH_INTERVAL_MILLIS: 10000
}

const InvalidationStatus = {
    INVALIDATED: 'INVALIDATED',
    FETCHING: 'FETCHING',
    FETCHED: 'FETCHED'
}

module.exports = {ActionStatus, GeneralConstants, InvalidationStatus}