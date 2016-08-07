const {actions} = require('react-redux-form')

const {GeneralConstants} = require('../constants')

function selectOption(option) {
    return dispatch => {
        dispatch(actions.change('newMessageBox.selectedOption', option))
    }
}

function newMessage(dispatch, promise, stateName) {
    const ongoingActionTimeout = setTimeout(() => {
        dispatch(actions.change(`${stateName}.ongoingAction`, true))
    }, GeneralConstants.ONGOING_ACTION_DELAY_MILLIS)

    dispatch(actions.submit(stateName, promise)).then(() => {
        clearTimeout(ongoingActionTimeout)

        dispatch(actions.change(`${stateName}.ongoingAction`, false))
        dispatch(actions.reset(stateName))
    })
}

module.exports = {
    selectOption,
    newMessage
}
