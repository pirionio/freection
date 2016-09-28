module.exports = {
    name: 'message-box',
    actions: [
        {
            name: 'new message box',
            private: true,
            params: ['messageType', 'context']
        },
        {
            name: 'select message box',
            private: true,
            params: ['currentMessageBoxId', 'selectedMessageBoxId', 'currentMessage']
        },
        {
            name: 'message sent',
            private: true,
            params: ['messageBoxId', 'shouldCloseMessageBox'],
            type: 'custom'
        },
        {
            name: 'close message box',
            private: true,
            params: ['messageBoxId']
        },
        {
            name: 'set focus',
            private: true,
            params: ['messageBoxId', 'focusOn']
        },
        {
            name: 'open expanded'
        },
        {
            name: 'close expanded'
        }
    ]
}
