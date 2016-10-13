import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import keys from 'lodash/keys'
import groupBy from 'lodash/groupBy'

import * as ThingHelper from '../../helpers/thing-helper'
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
        const {router} = this.context

        const countCircle = count ?
            <Ellipse color={router.isActive(pathname, false) ? styleVars.highlightColor : styleVars.menuTextColor }
                     text={count} oval={true} className={classes.circle} /> :
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
        const {config} = this.props

        const unreadThingsCount = ThingHelper.groupNotificationsByThing(this.props.newNotifications).length
        const unreadEmailsCount = keys(groupBy(this.props.newEmails, 'payload.threadId')).length

        return config.isDemo ? unreadThingsCount : unreadThingsCount + unreadEmailsCount
    }

    getToDoCount() {
        return this.props.todoThings.length
    }

    getFollowUpCount() {
        return this.props.followUpThings.length
    }

    getMentionedCount() {
        return this.props.mentions.length
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
            },
            {
                pathname: '/mentions',
                title: 'Mentioned',
                count: this.getMentionedCount()
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
        marginBottom: 28,
        position: 'relative'
    },
    linkBlock: {
        display: 'inline-block'
    },
    link: {
        fontSize: '0.857em',
        fontWeight: 500,
        color: styleVars.menuTextColor,
        textTransform: 'uppercase',
        textDecoration: 'none',
        letterSpacing: '0.05em',
        '&:hover': {
            color: 'white'
        }
    },
    linkActive: {
        color: styleVars.highlightColor
    },
    circle: {
        width: 33,
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
    mentions: PropTypes.array.isRequired,
    newEmails: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired
}

NavigationMenu.contextTypes = {
    router: PropTypes.object
}

function mapStateToProps(state) {
    return {
        routing: state.routing,
        newNotifications: state.whatsNew.notifications,
        todoThings: state.toDo.things,
        followUpThings: state.followUps.followUps,
        mentions: state.mentions.things,
        newEmails: state.unreadEmails.emails,
        config: state.config
    }
}

export default useSheet(connect(mapStateToProps)(NavigationMenu), style)