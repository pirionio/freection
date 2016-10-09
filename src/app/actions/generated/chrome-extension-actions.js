import ChromeExtensionActionsTypes from '../types/chrome-extension-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function setIsInstalled(isInstalled) {
    return {
        type: ChromeExtensionActionsTypes.SET_IS_INSTALLED,
        isInstalled
    }
}
