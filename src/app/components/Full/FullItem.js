import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import clickOutside from 'react-click-outside'
import Delay from 'react-delay'
import Icon from 'react-fontawesome'
import useSheet from 'react-jss'

import {getChildOfType, createSlots} from '../../util/component-util'
import Flexbox from '../UI/Flexbox'
import CommentList from '../Comment/CommentList'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import {GeneralConstants} from '../../constants'
import Close from '../../static/close-full-item.png'

const {FullItemSubject, FullItemUser, FullItemStatus, FullItemActions, FullItemBox} =
    createSlots('FullItemSubject', 'FullItemUser', 'FullItemStatus', 'FullItemActions', 'FullItemBox')

class FullItem extends  Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullItem.prototype)
    }

    componentDidMount() {
        // This is a patch - when clicking outside of the component, we attempt to close it.
        // But if the outside click was on a link that navigates to a different state, there's no need to close it (and it
        // might be buggy to try to).
        // So we save the initial path of the component, and use it to detect a state change before attempting to close.
        this.initialPath = window.location.pathname
    }

    handleClickOutside() {
        const {isExpandedOpened} = this.props

        // Ignore outside click if the expanded message modal is opened
        if (!isExpandedOpened) {
            // This has to happen in a timeout, since we want to perform the check only after a potential state change,
            // which will happen in the next event-loop tick.
            setTimeout(() => {
                if (this.initialPath === window.location.pathname)
                    this.props.close()
            })
        }
    }

    getSubject() {
        return getChildOfType(this.props.children, FullItemSubject)
    }

    getStatus() {
        const {statusColor, sheet: {classes}} = this.props

        const status = getChildOfType(this.props.children, FullItemStatus)
        return status ?
            <Flexbox name="full-item-status" shrink={0} container='column' justifyContent="center"
                     className={classes.status} style={{backgroundColor: statusColor}}>
                {status}
            </Flexbox> :
            null
    }

    getUser() {
        const {sheet: {classes}} = this.props

        const user = getChildOfType(this.props.children, FullItemUser)
        return user ?
            <Flexbox name="full-item-user" grow={1} shrink={0} container='column' justifyContent="center" className={classes.user}>
                {user}
            </Flexbox> :
            null
    }

    getActions() {
        const actions = getChildOfType(this.props.children, FullItemActions)
        return actions ?
            <Flexbox name="full-item-actions">
                {actions}
            </Flexbox> :
            null
    }

    getBox() {
        return getChildOfType(this.props.children, FullItemBox)
    }

    renderFetching() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="full-item-content" grow={1} container="column" justifyContent="center" alignItems="center" classNames={classes.item}>
                <Flexbox grow={1} container="row" alignItems="center">
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div className="full-item-loading">
                            <Icon name="spinner" pulse size="4x" className={classes.loadingIcon} />
                        </div>
                    </Delay>
                </Flexbox>
            </Flexbox>
        )
    }

    renderError() {
        const {sheet: {classes}} = this.props

        return (
            <Flexbox name="full-item-content" grow={1} container="row" justifyContent="flex-end" className={classes.item}>
                <Flexbox name="full-item-error" grow={1}>
                    We are sorry, the item could not be displayed!
                </Flexbox>
            </Flexbox>
        )
    }

    renderContent() {
        const {messages, sheet: {classes}} = this.props

        const status = this.getStatus()
        const user = this.getUser()
        const actions = this.getActions()

        return (
            <Flexbox name="full-item-content" grow={1} container="column" className={classes.item}>
                <Flexbox name="full-item-header" shrink={0} container="column" className={classes.header}>
                    <Flexbox name="first-header-row" className={classes.subject}>
                        <TextTruncate>{this.getSubject()}</TextTruncate>
                    </Flexbox>
                    <Flexbox name="second-header-row" container="row" justifyContent="flex-end" alignItems="center">
                        {status}
                        {user}
                        {actions}
                    </Flexbox>
                </Flexbox>
                <Flexbox name="full-item-body-container" grow={1} container="column" className={classes.content}>
                    <CommentList comments={messages} />
                </Flexbox>
            </Flexbox>
        )
    }

    render() {
        const {isFetching, isEmpty, sheet: {classes}} = this.props

        let content
        if (isFetching())
            content = this.renderFetching()
        else if (isEmpty())
            content = this.renderError()
        else
            content = this.renderContent()

        return (
            <Flexbox name="full-item-page" container="column" className={classes.page}>
                {content}
                {this.getBox()}
                <Flexbox name="close" className={classes.close} onClick={this.props.close}>
                    <img src={Close} />
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    page: {
        position: 'absolute',
        top: -styleVars.mainAppPadding,
        left: 40,
        right: 40,
        bottom: 0,
        zIndex: styleVars.fullItemZIndex,
        backgroundColor: styleVars.secondaryBackgroundColor,
        borderRight: '1px solid #e0e0e0',
        borderLeft: '1px solid #e0e0e0'
    },
    item: {
        marginBottom: 30,
        padding: [0, 39]
    },
    header: {
        height: 80,
        marginTop: 30
    },
    subject: {
        marginBottom: 17,
        fontSize: '1.5em',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: styleVars.basePurpleColor,
        minWidth: 0
    },
    content: {
        height: '100%',
        overflowY: 'hidden',
        marginTop: 10
    },
    status: {
        height: 20,
        width: 100,
        color: 'white',
        border: 'none',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    user: {
        marginLeft: 12,
        fontSize: '0.750em',
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    close: {
        position: 'absolute',
        top: 27,
        left: -54,
        fontSize: '2em',
        cursor: 'pointer'
    },
    loadingIcon: {
        marginLeft: 10
    }
}

FullItem.propTypes = {
    messages: PropTypes.array.isRequired,
    isFetching: PropTypes.func.isRequired,
    isEmpty: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    statusColor: PropTypes.string,
    isExpandedOpened: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        isExpandedOpened: state.expandedMessageBox.opened
    }
}


export default useSheet(connect(mapStateToProps)(clickOutside(FullItem)), style)

export {
    FullItemSubject,
    FullItemUser,
    FullItemStatus,
    FullItemActions,
    FullItemBox
}