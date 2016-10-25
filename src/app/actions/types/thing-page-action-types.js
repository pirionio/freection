const ThingPageActionsTypes = {
    SHOW: 'THING_PAGE_SHOW',
    HIDE: 'THING_PAGE_HIDE',
    GET_THING: 'THING_PAGE_GET_THING'
}

export default ThingPageActionsTypes

export function isOfTypeThingPage(type) {
    switch(type) {
        case ThingPageActionsTypes.SHOW:
        case ThingPageActionsTypes.HIDE:
        case ThingPageActionsTypes.GET_THING:
            return true
        default:
            return false
    }
}