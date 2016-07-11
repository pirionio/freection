const WhatsNewActionTypes = require('./types/whats-new-action-types')
const WhatsNewService = require('../services/whats-new-service')
const {ActionStatus} = require('../constants')

function requestWhatsNew() {
    return {
        type: WhatsNewActionTypes.FETCH_WHATS_NEW,
        status: ActionStatus.START
    }
}

function requestWhatsNewCompelte(things) {
    return {
        type: WhatsNewActionTypes.FETCH_WHATS_NEW,
        status: ActionStatus.COMPLETE,
        things
    }
}

const fetchWhatsNew = () => {
    return dispatch => {
        dispatch(requestWhatsNew())
        WhatsNewService.getThings().then(things => {
            dispatch(requestWhatsNewCompelte(things))
        })
    }

}

module.exports = {fetchWhatsNew}