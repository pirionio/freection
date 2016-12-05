import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {DropTarget} from 'react-dnd'
import Icon from 'react-fontawesome'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import {DragItemTypes} from '../../constants'

class PreviewGroupPlaceholder extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, PreviewGroupPlaceholder.prototype)
    }

    render() {
        const {isOver, connectDropTarget, sheet: {classes}} = this.props

        const containerClasses = classNames(classes.container, isOver ? classes.hover : undefined)

        return connectDropTarget(
            <div>
                <Flexbox name="drag-placeholder" container="row" alignItems="center" className={containerClasses}>
                    <Icon name="check-circle" className={classes.icon} />
                    <span>Nothing left to do here.</span>
                </Flexbox>
            </div>
        )
    }
}

const style = {
    container: {
        height: 60,
        lineHeight: 1.5,
        color: '#7f8b91',
        fontSize: '0.857em',
        letterSpacing: '0.016em',
        border: `1px solid ${styleVars.baseBorderColor}`
    },
    hover: {
        border: `1px solid ${styleVars.highlightColor}`
    },
    icon: {
        margin: [0, 15]
    }
}

PreviewGroupPlaceholder.propTypes = {

}

const dropTarget = {
    hover(props, monitor) {
        const draggedItemId = monitor.getItem().entityId
        const category = props.category
        props.moveToGroup(draggedItemId, category)
    }
}

function collectDrop(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

export default useSheet(DropTarget(DragItemTypes.PREVIEW_CARD, dropTarget, collectDrop)(PreviewGroupPlaceholder), style)