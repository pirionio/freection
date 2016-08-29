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
    FETCHED: 'FETCHED',
    REQUIRE_UPDATE: 'REQUIRE_UPDATE',
    UPDATING: 'UPDATING'
}

const PreviewDateGroups = {
    TODAY: 'TODAY',
    YESTERDAY: 'YESTERDAY',
    LAST_WEEK: 'LAST WEEK',
    OLDER: 'OLDER'
}

module.exports = {
    ActionStatus,
    GeneralConstants,
    InvalidationStatus,
    PreviewDateGroups
}