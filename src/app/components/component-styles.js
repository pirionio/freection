const styleVars = require('./style-vars')

module.exports = {
    sendButtonContainer: {
        width: 88
    },
    sendButton: {
        height: 39,
        width: '100%',
        color: '#0e0522',
        outline: 'none',
        border: `1px solid ${styleVars.primaryColor}`,
        backgroundColor: 'inherit',
        '&:focus':{
            border: `1px solid ${styleVars.highlightColor}`
        },
        '&:hover': {
            cursor: 'pointer',
            color: styleVars.highlightColor
        }
    },
    disabledSendButton: {
        backgroundColor: styleVars.disabledColor,
        border: '1px solid #bababa',
        cursor: 'not-allowed'
    }
}
