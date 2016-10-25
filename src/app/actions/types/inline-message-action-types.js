const InlineMessageActionsTypes = {
    SHOW: 'INLINE_MESSAGE_SHOW',
    CLOSE: 'INLINE_MESSAGE_CLOSE',
    MESSAGE_SENT: 'INLINE_MESSAGE_MESSAGE_SENT'
}

export default InlineMessageActionsTypes

export function isOfTypeInlineMessage(type) {
    switch(type) {
        case InlineMessageActionsTypes.SHOW:
        case InlineMessageActionsTypes.CLOSE:
        case InlineMessageActionsTypes.MESSAGE_SENT:
            return true
        default:
            return false
    }
}