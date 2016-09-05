const React = require('react')
const {PropTypes} = React
const useSheet = require('react-jss').default

const Flexbox = require('../../UI/Flexbox')
const styleVars = require('../../style-vars')

const PingPreviewText = ({newNotifications, sheet: {classes}}) => {
    const unreadCount = newNotifications.length > 1 ?
        <Flexbox className={classes.unreadCount}>
            (+{newNotifications.length - 1})
        </Flexbox> : null

    return (
        <Flexbox container="row" alignItems="center">
            <Flexbox className={classes.text}>
               Ping!
            </Flexbox>
            {unreadCount}
        </Flexbox>
    )
}

const style = {
    unreadCount: {
        color: styleVars.baseGrayColor,
        marginLeft: 6,
        fontSize: '0.85em'
    },
    text: {
        display: 'inline-block'
    }
}

PingPreviewText.propTypes = {
    newNotifications: PropTypes.array
}
PingPreviewText.defaultProps = {
    newNotifications: []
}

module.exports = useSheet(PingPreviewText, style)