module.exports = {
    name: 'message-box',
    actions: [
        {
            name: 'new message',
            params: ['messageType', 'context']
        },
        {
            name: 'select message box',
            params: ['currentMessageBox', 'selectedMessageBox', 'currentMessage']
        },
        {
            name: 'message sent',
            params: ['messageBox', 'shouldCloseMessageBox'],
            type: 'custom'
        },
        {
            name: 'close message box',
            params: ['messageBox']
        }
    ]
}
