const AllThingsActionsTypes = {
    SET_STATE: 'ALL_THINGS_SET_STATE',
    FETCH_ALL_THINGS: 'ALL_THINGS_FETCH_ALL_THINGS'
}

export default AllThingsActionsTypes

export function isOfTypeAllThings(type) {
    switch(type) {
        case AllThingsActionsTypes.SET_STATE:
        case AllThingsActionsTypes.FETCH_ALL_THINGS:
            return true
        default:
            return false
    }
}