const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const keys = require('lodash/keys')
const groupBy = require('lodash/groupBy')

const Link = require('../UI/Link')
const Flexbox = require('../UI/Flexbox')
const Ellipse = require('../UI/Ellipse')
const styleVars = require('../style-vars')

class NavigationMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, NavigationMenu.prototype)
    }

    getLink({pathname, title, count}) {
        const styles = this.getStyles()

        const countCircle = count.count ?
            <Ellipse width="30px" height="22px" color={count.color} text={count.count} style={styles.circle} /> :
            null

        const arrow = window.location.pathname.startsWith(pathname) && <span style={styles.arrow}></span>

        return (
            <div name="link-container" key={pathname}>
                <Flexbox name="link-row" container="row" alignItems="center" style={styles.linkRow}>
                    <Flexbox grow={1} style={{display: 'inline-block'}}>
                        <Link to={pathname} style={styles.link} activeStyle={styles.link.active}>{title}</Link>
                    </Flexbox>
                    {countCircle}
                    {arrow}
                </Flexbox>
            </div>
        )
    }

    getWhatsNewCount() {
        const unreadThingsCount = keys(groupBy(this.props.newNotifications, 'thing.id')).length
        const unreadEmailsCount = keys(groupBy(this.props.newEmails, 'payload.threadId')).length

        return {
            color: styleVars.highlightColor,
            count: unreadThingsCount + unreadEmailsCount
        }
    }

    getToDoCount() {
        return {
            color: styleVars.baseBlueColor,
            count: this.props.todoThings.length
        }
    }

    getFollowUpCount() {
        return {
            color: styleVars.basePurpleColor,
            count: this.props.followUpThings.length
        }
    }

    getStyles() {
        return {
            menu: {
                paddingTop: 34,
                paddingLeft: 27
            },
            linkRow: {
                height: '25px',
                marginBottom: '40px',
                position: 'relative'
            },
            link: {
                fontFamily: 'Roboto Mono, monospace',
                fontSize: '0.857em',
                fontWeight: 500,
                color: styleVars.menuTextColor,
                textTransform: 'uppercase',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                ':hover': {
                    color: styleVars.highlightColor
                },
                active: {
                    color: 'white'
                }
            },
            circle: {
                marginRight: '26px',
                paddingTop: '3px',
                textAlign: 'center',
                borderBottomLeftRadius: '100%30px',
                borderBottomRightRadius: '100%30px',
                borderTopLeftRadius: '100%30px',
                borderTopRightRadius: '100%30px'
            },
            arrow: {
                position: 'absolute',
                right: 0,
                top: 8,
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: `6px solid ${styleVars.backgroundColor}`
            }
        }
    }

    render() {
        const {config} = this.props
        const styles = this.getStyles()

        const links = [
            {
                pathname: '/whatsnew',
                title: 'What\'s New',
                count: this.getWhatsNewCount()
            },
            {
                pathname: '/todo',
                title: 'To Do',
                count: this.getToDoCount()
            },
            {
                pathname: '/followup',
                title: 'Follow Up',
                count: this.getFollowUpCount()
            }
        ].map(this.getLink)

        if (config.isDemo) {
            links.push(this.getLink({
                pathname: '/mentions',
                title: 'Mentions',
                count: {
                    count: 3,
                    color: styleVars.baseGreenColor
                }
            }))
        }

        return (
            <Flexbox name="navigation-menu-container" grow={config.isDemo ? 0 : 1} style={styles.menu}>
                {links}
            </Flexbox>
        )
    }
}

NavigationMenu.propTypes = {
    config: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired,
    newNotifications: PropTypes.array.isRequired,
    todoThings: PropTypes.array.isRequired,
    followUpThings: PropTypes.array.isRequired,
    newEmails: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        config: state.config,
        routing: state.routing,
        newNotifications: state.whatsNew.notifications,
        todoThings: state.toDo.things,
        followUpThings: state.followUps.followUps,
        newEmails: state.unreadEmails.emails
    }
}

module.exports = connect(mapStateToProps)(radium(NavigationMenu))