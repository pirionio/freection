import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {compose} from 'redux'
import {DragSource, DropTarget} from 'react-dnd'
import {getEmptyImage} from 'react-dnd-html5-backend'
import trimEnd from 'lodash/trimEnd'
import first from 'lodash/first'
import last from 'lodash/last'

import * as ThingHelper from '../../../common/helpers/thing-helper'
import Flexbox from '../UI/Flexbox'
import Ellipse from '../UI/Ellipse'
import TextTruncate from '../UI/TextTruncate'
import styleVars from '../style-vars'
import {DragItemTypes} from '../../constants'
import ThingSource from '../../../common/enums/thing-source'
import ThingStatus from '../../../common/enums/thing-status'
import EntityTypes from '../../../common/enums/entity-types'

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

    getDragHandle() {
        const {connectDragSource, sheet: {classes}} = this.props
        return connectDragSource(
            <div className={classes.dragHandle}></div>
        )
    }

    getSource() {
        const {thing, sheet: {classes}} = this.props

        const source = thing.payload.source ? ThingSource[thing.payload.source] : 'Freection'

        return (
            <div className={classes.source}>{source}</div>
        )
    }

    getStatus() {
        const {thing, sheet: {classes}} = this.props

        let statusColor

        switch (thing.payload.status) {
            case ThingStatus.CLOSE.key:
            case ThingStatus.DISMISS.key:
                statusColor = styleVars.redCircleColor
                break
            case ThingStatus.NEW.key:
            case ThingStatus.INPROGRESS.key:
            case ThingStatus.REOPENED.key:
                statusColor = styleVars.blueCircleColor
                break
            case ThingStatus.DONE.key:
                statusColor = styleVars.greenCircleColor
                break
        }

        return (
            <Flexbox name="preview-circle" shrink={0} container='column' justifyContent="center" className={classes.circleContainer}>
                <Ellipse color={statusColor} className={classes.circle} />
            </Flexbox>
        )
    }

    getRecipients() {
        const {thing, sheet: {classes}} = this.props

        const recipients =
            thing.isCreator ? 'Me' :
            thing.type.key === EntityTypes.THING.key ? thing.creator.displayName :
            thing.type.key === EntityTypes.EMAIL_THING ? this.getEmailRecipients() :
            ''

        return (
            <div className={classes.recipients}>
                <TextTruncate>{recipients}</TextTruncate>
            </div>
        )
    }

    getEmailRecipients() {
        const {thing, currentUser} = this.props

        const recipientNames = thing.payload.recipients
            .filter(recipient => recipient.emailAddress !== currentUser.email)
            .map(recipient => recipient.name)
            .join(', ')

        return trimEnd(recipientNames, ', ')
    }

    getSubject() {
        return this.props.thing.subject
    }

    getContent() {
        const {thing} = this.props

        const unreadEvents = ThingHelper.getUnreadMessages(thing)
        const readEvents = ThingHelper.getReadMessages(thing)

        if (unreadEvents && unreadEvents.length)
            return first(unreadEvents).payload.text

        if (readEvents && readEvents.length)
            return last(readEvents).payload.text

        return ''
    }

    render() {
        const {connectDragPreview, connectDropTarget, isDragging, sheet: {classes}} = this.props

        const cardClasses = classNames(classes.previewCard, isDragging ? classes.previewCardDragging : undefined)

        return compose(connectDragPreview, connectDropTarget)(
            <div name="preview-card-draggable" className={cardClasses}>
                {this.getDragHandle()}
                <Flexbox name="preview-card" container="column">
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
        width: 250,
        height: 250,
        float: 'left',
        position: 'relative',
        backgroundColor: styleVars.secondaryBackgroundColor,
        border: `1px solid ${styleVars.baseBorderColor}`,
        marginBottom: 10,
        padding: [15, 21],
        '&:not(:last-of-type)': {
            marginRight: 10
        }
    },
    previewCardDragging: {
        opacity: 0
    },
    metadata: {
        height: 50,
        borderBottom: `1px solid #dbdee1`,
        paddingBottom: 17
    },
    content: {
        paddingTop: 17
    },
    subject: {
        height: 46,
        marginBottom: 21,
        fontSize: '1.286em',
        letterSpacing: '0.025em',
        color: 'black'
    },
    source: {
        fontSize: '0.714em'
    },
    recipients: {
        marginTop: 17
    },
    lastComment: {
        height: 65,
        letterSpacing: '0.025em',
        color: 'black'
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
        top: 0,
        left: 0,
        height: '100%',
        width: 15,
        cursor: 'move',
        backgroundColor: 'lightgray'
    }
}

PreviewCard.propTypes = {

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