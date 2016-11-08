import {KeyBindingUtil} from 'draft-js'

export function isCommandEnter(event) {
    return event.key === 'Enter' && KeyBindingUtil.hasCommandModifier(event)
}
