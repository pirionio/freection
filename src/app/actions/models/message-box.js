module.exports = {
    name: 'message-box',
    actions: [
        {
            name: 'new message box',
            params: ['messageType', 'context']
        },
        {
            name: 'select message box',
            params: ['currentMessageBoxId', 'selectedMessageBoxId', 'currentMessage']
        },
        {
            name: 'message sent',
            params: ['messageBoxId', 'shouldCloseMessageBox'],
            type: 'custom'
        },
        {
            name: 'close message box',
            params: ['messageBoxId']
        },
        {
            name: 'set focus',
            params: ['messageBoxId', 'focusOn']
        }
    ]
}
