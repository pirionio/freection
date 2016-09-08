import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import keys from 'lodash/keys'
import groupBy from 'lodash/groupBy'

import Link from '../UI/Link'
import Flexbox from '../UI/Flexbox'
import Ellipse from '../UI/Ellipse'
import styleVars from '../style-vars'

class NavigationMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, NavigationMenu.prototype)
    }

    getLink({pathname, title, count}) {
        const {classes} = this.props.sheet

        const countCircle = count.count ?
            <Ellipse color={count.color} text={count.count} oval={true} className={classes.circle} /> :
            null

        const arrow = window.location.pathname.startsWith(pathname) && <span className={classes.arrow}></span>

        return (
            <div name="link-container" key={pathname}>
                <Flexbox name="link-row" container="row" alignItems="center" className={classes.linkRow}>
                    <Flexbox grow={1} className={classes.linkBlock}>
                        <Link to={pathname} className={classes.link} activeClassName={classes.linkActive}>{title}</Link>
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

    render() {
        const {sheet: {classes}} = this.props

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

        return (
            <Flexbox name="navigation-menu-container" grow={1} className={classes.menu}>
                {links}
            </Flexbox>
        )
    }
}

const style = {
    menu: {
        paddingTop: 34,
        paddingLeft: 27
    },
    linkRow: {
        height: 25,
        marginBottom: 40,
        position: 'relative'
    },
    linkBlock: {
        display: 'inline-block'
    },
    link: {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: 0.857,
        fontWeight: 500,
        color: styleVars.menuTextColor,
        textTransform: 'uppercase',
        textDecoration: 'none',
        letterSpacing: '0.05em',
        '&:hover': {
            color: styleVars.highlightColor
        }
    },
    linkActive: {
        color: 'white'
    },
    circle: {
        width: 30,
        height: 22,
        marginRight: 26,
        paddingTop: 3,
        textAlign: 'center'
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

NavigationMenu.propTypes = {
    routing: PropTypes.object.isRequired,
    newNotifications: PropTypes.array.isRequired,
    todoThings: PropTypes.array.isRequired,
    followUpThings: PropTypes.array.isRequired,
    newEmails: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        routing: state.routing,
        newNotifications: state.whatsNew.notifications,
        todoThings: state.toDo.things,
        followUpThings: state.followUps.followUps,
        newEmails: state.unreadEmails.emails
    }
}

export default useSheet(connect(mapStateToProps)(NavigationMenu), style)