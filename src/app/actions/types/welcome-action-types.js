const WelcomeActionsTypes = {
    SET_WELCOME_STATUS: 'WELCOME_SET_WELCOME_STATUS'
}

export default WelcomeActionsTypes

export function isOfTypeWelcome(type) {
    switch(type) {
        case WelcomeActionsTypes.SET_WELCOME_STATUS:
            return true
        default:
            return false
    }
}