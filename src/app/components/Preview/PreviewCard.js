import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {compose} from 'redux'
import {DragSource, DropTarget} from 'react-dnd'
import {getEmptyImage} from 'react-dnd-html5-backend'
import first from 'lodash/first'
import last from 'lodash/last'
import isNil from 'lodash/isNil'

import * as ThingHelper from '../../../common/helpers/thing-helper'
import Flexbox from '../UI/Flexbox'
import Ellipse from '../UI/Ellipse'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import {GeneralConstants, DragItemTypes} from '../../constants'
import ThingSource from '../../../common/enums/thing-source'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'
import {getChildOfType, createSlots} from '../../util/component-util'
import SlackLogo from '../../static/SlackLogo.svg'
import GmailLogo from '../../static/GmailLogo.svg'
import GithubLogo from '../../static/GithubLogo.png'
import AsanaLogo from '../../static/AsanaLogo.jpg'
import TrelloLogo from '../../static/TrelloLogo.png'
import FreectionLogo from '../../static/logo-black-39x10.png'

const {PreviewCardRecipients, PreviewCardActions} = createSlots('PreviewCardRecipients', 'PreviewCardActions')

class PreviewCard extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, PreviewCard.prototype)
    }

    getSource() {
        const {thing, sheet: {classes}} = this.props

        const source =
            thing.payload.source ? ThingSource[thing.payload.source].label :
            thing.type.key === EntityTypes.GITHUB.key ? EntityTypes.GITHUB.label :
            'Freection'

        return (
            <div className={classes.source}>
                {this.getSourceLogo()}
                {source}
            </div>
        )
    }

    getSourceLogo() {
        const {thing, sheet: {classes}} = this.props

        if (thing.payload.source === ThingSource.SLACK.key)
            return <img src={SlackLogo} className={classes.sourceLogoSquare} />

        if (thing.payload.source === ThingSource.GMAIL.key)
            return <img src={GmailLogo} className={classes.sourceLogoSquare} />

        if (thing.payload.source === ThingSource.GITHUB.key || thing.type.key === EntityTypes.GITHUB.key)
            return <img src={GithubLogo} className={classes.sourceLogoSquare} />

        if (thing.payload.source === ThingSource.ASANA.key)
            return <img src={AsanaLogo} className={classes.sourceLogoSquare} />

        if (thing.payload.source === ThingSource.TRELLO.key)
            return <img src={TrelloLogo} className={classes.sourceLogoSquare} />

        return <img src={FreectionLogo} className={classes.sourceLogoRectangle} />
    }

    getStatus() {
        const {thing, sheet: {classes}} = this.props

        let statusColor

        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                statusColor = styleVars.blueCircleColor
                break
            case ThingStatus.INPROGRESS.key:
                statusColor = styleVars.yellowCircleColor
                break
            case ThingStatus.DONE.key:
                statusColor = styleVars.greenCircleColor
                break
            case ThingStatus.DISMISS.key:
                statusColor = styleVars.redCircleColor
                break
            case ThingStatus.CLOSE.key:
                statusColor = styleVars.greyCircleColor
                break
        }

        return (
            <Flexbox name="preview-circle" shrink={0} container='column' justifyContent="center" className={classes.circleContainer}>
                <Ellipse color={statusColor} className={classes.circle} />
            </Flexbox>
        )
    }

    getRecipients() {
        const {sheet: {classes}} = this.props

        const recipients = getChildOfType(this.props.children, PreviewCardRecipients)

        return (
            <div className={classes.recipients}>
                <TextTruncate>{recipients}</TextTruncate>
            </div>
        )
    }

    getSubject() {
        const {thing} = this.props
        return thing.subject.length < GeneralConstants.PREVIEW_CARD_SUBJECT_TRIM_INDEX ? thing.subject :
            thing.subject.substr(0, GeneralConstants.PREVIEW_CARD_SUBJECT_TRIM_INDEX - 3) + '...'
    }

    getContent() {
        const {thing, sheet: {classes}} = this.props

        const unreadEvents = ThingHelper.getUnreadMessages(thing)
        const readEvents = ThingHelper.getReadMessages(thing)

        let text = ''
        let unreadCount = null

        if (unreadEvents && unreadEvents.length) {
            text = first(unreadEvents).payload.text
            unreadCount = unreadEvents.length > 1 ?
                <span className={classes.unreadCount}>
                    (+{unreadEvents.length - 1})
                </span> : null
        }

        if (readEvents && readEvents.length) {
            text = last(readEvents).payload.text
        }

        if (text.length >= GeneralConstants.PREVIEW_CARD_COMMENT_TRIM_INDEX) {
            text = text.substr(0, GeneralConstants.PREVIEW_CARD_COMMENT_TRIM_INDEX - 3) + '...'
        }

        const lastCommentClass = classNames(classes.lastCommentText, GeneralConstants.INSPECTLET_SENSITIVE_CLASS)

        return (
            <div name="last-comment-text" className={lastCommentClass}>
                <span>{text}</span>
                {unreadCount}
            </div>
        )
    }

    getActions() {
        const {sheet: {classes}} = this.props
        
        const original = getChildOfType(this.props.children, PreviewCardActions)
        return React.cloneElement(original, {
            className: classes.commandsBar,
            commandClassName: classes.command
        })
    }

    render() {
        const {connectDragSource, connectDropTarget, isDragging, onClick, sheet: {classes}} = this.props

        const cardClasses = classNames(classes.previewCard, isDragging ? classes.previewCardDragging : undefined)
        const subjectClasses = classNames(classes.subject, GeneralConstants.INSPECTLET_SENSITIVE_CLASS)

        return compose(connectDragSource, connectDropTarget)(
            <div name="preview-card-draggable" className={cardClasses}>
                <Flexbox name="preview-card" container="column">
                    <div name="overlay" className={classes.overlay} onClick={onClick} />
                    <div name="actions" className={classes.actions}>
                        {this.getActions()}
                    </div>
                    <Flexbox name="thing-metadata" container="column" grow={0} shrink={0} className={classes.metadata}>
                        <Flexbox name="first-row" container="row" justifyContent="space-between">
                            {this.getSource()}
                            {this.getStatus()}
                        </Flexbox>
                        <Flexbox name="second-row">
                            {this.getRecipients()}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="thing-content" container="column" grow={1} className={classes.content}>
                        <Flexbox name="subject" className={subjectClasses}>
                            {this.getSubject()}
                        </Flexbox>
                        <Flexbox name="last-comment" className={classes.lastComment}>
                            {this.getContent()}
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </div>
        )
    }
}

const style = {
    previewCard: {
        position: 'relative',
        width: 250,
        height: 193,
        float: 'left',
        backgroundColor: styleVars.secondaryBackgroundColor,
        border: `1px solid ${styleVars.baseBorderColor}`,
        marginBottom: 10,
        '&:not(:last-of-type)': {
            marginRight: 10
        },
        '&:hover': {
            '& $overlay': {
                display: 'block'
            },
            '& $actions': {
                display: 'block'
            }
        }
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: styleVars.glassPaneColor,
        zIndex: styleVars.backZIndex,
        display: 'none',
        cursor: 'pointer'
    },
    actions: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        width: '100%',
        display: 'none',
        zIndex: styleVars.actionsHoverZIndex,
        '& .js-button:not(:first-of-type)': {
            marginLeft: 5
        }
    },
    commandsBar: {
        justifyContent: 'center',
        backgroundColor: styleVars.secondaryBackgroundColor
    },
    command: {
        paddingLeft: 0,
        paddingRight: 0,
        width: 75
    },
    previewCardDragging: {
        opacity: 0
    },
    metadata: {
        position: 'relative',
        height: 65,
        borderBottom: `1px solid #dbdee1`,
        padding: [15, 24, 17, 29]
    },
    content: {
        position: 'relative',
        padding: [17, 24, 15, 29]
    },
    subject: {
        height: 43,
        lineHeight: '23px',
        marginBottom: 11,
        letterSpacing: '0.025em',
        color: 'black',
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
    source: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        fontSize: '0.714em'
    },
    sourceLogoSquare: {
        height: 15,
        width: 15,
        marginRight: 8
    },
    sourceLogoRectangle: {
        height: 9,
        width: 39,
        marginRight: 8
    },
    recipients: {
        marginTop: 22
    },
    lastComment: {
        height: 40,
        lineHeight: '21px',
        fontSize: '0.857em',
        fontWeight: '300',
        letterSpacing: '0.025em',
        color: 'black',
        overflowY: 'hidden'
    },
    lastCommentText: {
        overflowX: 'hidden',
        textOverflow: 'ellipsis'
    },
    unreadCount: {
        color: styleVars.baseGrayColor,
        marginLeft: 6,
        fontSize: '0.85em'
    },
    circleContainer: {
        width: 8,
        height: 8
    },
    circle: {
        width: 8,
        height: 8
    }
}

PreviewCard.propTypes = {
    thing: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    allowDrag: PropTypes.bool,
    allowDrop: PropTypes.bool
}

PreviewCard.defaultProps = {
    allowDrag: true,
    allowDrop: true
}

const itemDragSource = {
    beginDrag(props) {
        return {
            entityId: props.entityId,
            index: props.index,
            category: props.category
        }
    },

    canDrag(props) {
        // For some reason, props does not include allowDrag when it's not specific explicitly (i.e. set via the defaultProps).
        // So we have to consider a nil value as a true value (drag is allowed by default...)
        return isNil(props.allowDrag) || !!props.allowDrag
    }
}

const itemDropTarget = {
    hover(props, monitor) {
        if (!isNil(props.allowDrop) && !props.allowDrop)
            return

        const draggedItemId = monitor.getItem().entityId
        const hoveredItemId = props.entityId
        
        if (draggedItemId !== hoveredItemId)
            props.reorder(draggedItemId, hoveredItemId)
    },
    
    drop(props) {
        props.commitReorder()
    },

    canDrop(props) {
        return isNil(props.allowDrop) || !!props.allowDrop
    }
}

function collectDrag(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

function collectDrop(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.userProfile
    }
}

export default useSheet(
    compose(
        DragSource(DragItemTypes.PREVIEW_CARD, itemDragSource, collectDrag),
        DropTarget(DragItemTypes.PREVIEW_CARD, itemDropTarget, collectDrop),
        connect(mapStateToProps))
    (PreviewCard), style)

export {
    PreviewCardRecipients,
    PreviewCardActions
}