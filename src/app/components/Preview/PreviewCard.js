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
import FreectionLogo from '../../static/logo-black-39x10.png'
import DragHandle from '../../static/dnd-bg.png'

const {PreviewCardRecipients, PreviewCardActions} = createSlots('PreviewCardRecipients', 'PreviewCardActions')

class PreviewCard extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, PreviewCard.prototype)
    }

    // Uncomment this if the dragged items are not captured properly by the browser.
    
    // componentDidMount() {
    //     const {connectDragPreview} = this.props
    //
    //     if (connectDragPreview) {
    //         // Use empty image as a drag preview so browsers don't draw it
    //         // and we can draw whatever we want on the custom drag layer instead.
    //         connectDragPreview(getEmptyImage(), {
    //             // IE fallback: specify that we'd rather screenshot the node
    //             // when it already knows it's being dragged so we can hide it with CSS.
    //             captureDraggingState: true
    //         })
    //     }
    // }

    getDragHandle(className) {
        const {connectDragSource, sheet: {classes}} = this.props

        const handleClasses = classNames(classes.dragHandle, className)

        return connectDragSource(
            <div className={handleClasses}>
                <img src={DragHandle} />
            </div>
        )
    }

    getMetadataDragHandle() {
        const {sheet: {classes}} = this.props
        return this.getDragHandle(classes.dragHandleMetadata)
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

        if (thing.type.key === EntityTypes.GITHUB.key)
            return <img src={GithubLogo} className={classes.sourceLogoSquare} />

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
        return this.props.thing.subject
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

        if (text.length >= GeneralConstants.PREVIEW_CARD_TEXT_TRIM_INDEX) {
            text = text.substr(0, GeneralConstants.PREVIEW_CARD_TEXT_TRIM_INDEX - 3) + '...'
        }

        return (
            <div name="last-comment-text" className={classes.lastCommentText}>
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
        const {connectDragPreview, connectDropTarget, isDragging, onClick, sheet: {classes}} = this.props

        const cardClasses = classNames(classes.previewCard, isDragging ? classes.previewCardDragging : undefined)

        return compose(connectDragPreview, connectDropTarget)(
            <div name="preview-card-draggable" className={cardClasses}>
                <Flexbox name="preview-card" container="column">
                    <div name="overlay" className={classes.overlay} onClick={onClick} />
                    <div name="actions" className={classes.actions}>
                        {this.getActions()}
                    </div>
                    <Flexbox name="thing-metadata" container="column" grow={0} shrink={0} className={classes.metadata}>
                        {this.getMetadataDragHandle()}
                        <Flexbox name="first-row" container="row" justifyContent="space-between">
                            {this.getSource()}
                            {this.getStatus()}
                        </Flexbox>
                        <Flexbox name="second-row">
                            {this.getRecipients()}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="thing-content" container="column" grow={1} className={classes.content}>
                        <Flexbox name="subject" className={classes.subject}>
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
        height: 250,
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
        zIndex: styleVars.dragHandleZIndex,
        '& .js-button:not(:first-of-type)': {
            marginLeft: 5
        }
    },
    commandsBar: {
        justifyContent: 'center'
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
        height: 44,
        marginBottom: 21,
        fontSize: '1.286em',
        letterSpacing: '0.025em',
        color: 'black',
        overflowY: 'hidden'
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
        height: 65,
        lineHeight: 1.5,
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
    },
    dragHandle: {
        position: 'absolute',
        left: 10,
        cursor: 'move',
        overflowY: 'hidden',
        zIndex: styleVars.dragHandleZIndex
    },
    dragHandleMetadata: {
        height: 36
    },
    dragHandleContent: {
        height: 168,
        top: 11
    }
}

PreviewCard.propTypes = {
    thing: PropTypes.object.isRequired,
    onClick: PropTypes.func
}

const itemDragSource = {
    beginDrag(props) {
        return {
            entityId: props.entityId,
            index: props.index,
            category: props.category
        }
    }
}

const itemDropTarget = {
    hover(props, monitor) {
        const draggedItemId = monitor.getItem().entityId
        const hoveredItemId = props.entityId
        
        if (draggedItemId !== hoveredItemId)
            props.reorder(draggedItemId, hoveredItemId)
    },
    
    drop(props) {
        props.commitReorder()
    }
}

function collectDrag(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
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
        currentUser: state.auth
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