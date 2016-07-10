
const WhatsNewActionTypes = require('../actions/types/whats-new-action-types')

const initialState = {
    things: [
        {
            id: 1,
            createAt: new Date(),
            creator: 'Daniel',
            assignee: 'Doron',
            subject: 'Fuck Off',
            body: 'This is the first thing we are going to do'
        },
        {
            id: 2,
            createAt: new Date(),
            creator: 'Doron',
            assignee: 'Daniel',
            subject: 'I change to yellow',
            body: 'Had enough with HaPoel'
        }
    ]
}

module.exports = (state = initialState, action) => {
    switch (action.type) {
        case WhatsNewActionTypes.FETCH_WHATS_NEW:
            return {
                things: state.things,
                isFetchingWhatsNew: true
            }
        default:
            return {
                things: state.things,
                isFetchingWhatsNew: false
            }
    }
}