const styleVars = require('./style-vars')

module.exports = {
    sendButton: {
        width: '88px',
        button: {
            height: '39px',
            width: '100%',
            color: '#0e0522',
            outline: 'none',
            border: `1px solid ${styleVars.primaryColor}`,
            backgroundColor: 'inherit',
            ':focus':{
                border: `1px solid ${styleVars.highlightColor}`
            },
            ':hover': {
                cursor: 'pointer',
                color: styleVars.highlightColor
            }
        },
        disabled: {
            backgroundColor: styleVars.disabledColor,
            border: '1px solid #bababa',
            cursor: 'not-allowed'
        }
    }
}
