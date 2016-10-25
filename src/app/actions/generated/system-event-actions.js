import SystemEventActionsTypes from '../types/system-event-action-types'
import {ActionStatus} from '../../constants'
import * as ResourceUtil from '../../util/resource-util'

export function reconnected() {
    return {
        type: SystemEventActionsTypes.RECONNECTED        
    }
}
