import ChromeExtensionActionTypes from '../actions/types/chrome-extension-action-types'

const initialState = {
    isInstalled: false
}

export default function auth(state = initialState, action){
    if (action.type === ChromeExtensionActionTypes.SET_IS_INSTALLED)
        return {
            isInstalled: action.isInstalled
        }

    return state
}