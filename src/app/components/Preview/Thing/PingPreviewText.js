const React = require('react')
const {PropTypes} = React

const Flexbox = require('../../UI/Flexbox')
const styleVars = require('../../style-vars')

const PingPreviewText = ({newNotifications}) => {
    const style = {
        unreadCount: {
            color: styleVars.baseGrayColor,
            marginLeft: '6px',
            fontSize: '0.85em'
        },
        text: {
            display: 'inline-block'
        }
    }

    const unreadCount = newNotifications.length > 1 ?
        <Flexbox style={style.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container="row" alignItems="center">
            <Flexbox style={style.text}>
               Ping!
            </Flexbox>
            {unreadCount}
        </Flexbox>
    )
}

PingPreviewText.propTypes = {
    newNotifications: PropTypes.array
}
PingPreviewText.defaultProps = {
    newNotifications: []
}

module.exports = PingPreviewText