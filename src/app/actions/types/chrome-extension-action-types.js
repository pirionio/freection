const ChromeExtensionActionsTypes = {
    SET_IS_INSTALLED: 'CHROME_EXTENSION_SET_IS_INSTALLED'
}

export default ChromeExtensionActionsTypes

export function isOfTypeChromeExtension(type) {
    switch(type) {
        case ChromeExtensionActionsTypes.SET_IS_INSTALLED:
            return true
        default:
            return false
    }
}