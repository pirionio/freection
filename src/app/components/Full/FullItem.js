import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import clickOutside from 'react-click-outside'
import Delay from 'react-delay'
import Icon from 'react-fontawesome'
import useSheet from 'react-jss'
import classNames from 'classnames'

import {getChildOfType, createSlots} from '../../util/component-util'
import Flexbox from '../UI/Flexbox'
import CommentList from '../Comment/CommentList'
import Ellipse from '../UI/Ellipse'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import {GeneralConstants} from '../../constants'

const {FullItemSubject, FullItemStatus, FullItemActions, FullItemBox} =
    createSlots('FullItemSubject', 'FullItemStatus', 'FullItemActions', 'FullItemBox')

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
        // This has to happen in a timeout, since we want to perform the check only after a potential state change,
        // which will happen in the next event-loop tick.
        setTimeout(() => {
            if (this.initialPath === window.location.pathname)
                this.props.close()
        })
    }

    getSubject() {
        return getChildOfType(this.props.children, FullItemSubject)
    }

    getStatus() {
        const {circleColor, sheet: {classes}} = this.props

        const status = getChildOfType(this.props.children, FullItemStatus)
        return status ?
            <Flexbox name="full-item-circle" width='19px' shrink={0} container='column' justifyContent="center">
                <Ellipse className={classes.statusCircle} color={circleColor} />
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
        const actions = this.getActions()

        const prevClass = classNames(classes.navigationOption, classes.prev)
        const nextClass = classNames(classes.navigationOption, classes.next)

        return (
            <Flexbox name="full-item-content" grow={1} container="column" className={classes.item}>
                <Flexbox name="full-item-navigation" container="row" alignItems="center" className={classes.navigationBar}>
                    <Flexbox name="prev-item" className={prevClass}>
                        <Icon name="chevron-left" className={classes.prevArrow} />
                        <span>Previous</span>
                    </Flexbox>
                    <Flexbox name="next-item" className={nextClass}>
                        <span>Next</span>
                        <Icon name="chevron-right" className={classes.nextArrow} />
                    </Flexbox>
                </Flexbox>
                <Flexbox name="full-item-header" container="row" alignItems="center" className={classes.header}>
                    {status}
                    <Flexbox name="full-item-subject" grow={1} className={classes.subject}>
                        <TextTruncate>{this.getSubject()}</TextTruncate>
                    </Flexbox>
                    {actions}
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
                <Flexbox name="close" className={classes.close}>
                    <Icon name="times-circle" onClick={this.props.close} />
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    page: {
        position: 'absolute',
        top: -35,
        left: 40,
        right: 40,
        bottom: 0,
        zIndex: styleVars.fullItemZIndex,
        filter: 'none',
        boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)'
    },
    item: {
        marginBottom: 30,
        padding: [0, 39],
        backgroundColor: styleVars.secondaryBackgroundColor
    },
    navigationBar: {
        height: 80
    },
    navigationOption: {
        fontSize: '0.7em',
        fontWeight: 'bold',
        color: 'black',
        cursor: 'pointer',
        textTransform: 'uppercase'
    },
    prev: {
        borderRight: '1px solid black',
        paddingRight: 25
    },
    prevArrow: {
        marginRight: 25
    },
    next: {
        marginLeft: 25
    },
    nextArrow: {
        marginLeft: 25
    },
    header: {
        height: 75
    },
    subject: {
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
    statusCircle: {
        height: 8,
        width: 8,
        marginRight: 11
    },
    close: {
        position: 'absolute',
        top: 25,
        left: -31,
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
    circleColor: PropTypes.string
}

export default useSheet(clickOutside(FullItem), style)

export {
    FullItemSubject,
    FullItemStatus,
    FullItemActions,
    FullItemBox
}