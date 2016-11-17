import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {DropTarget} from 'react-dnd'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import {DragItemTypes} from '../../constants'

class PreviewGroupPlaceholder extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, PreviewGroupPlaceholder.prototype)
    }

    render() {
        const {category, isOver, connectDropTarget, sheet: {classes}} = this.props

        const containerClasses = classNames(classes.container, isOver ? classes.hover : undefined)

        return connectDropTarget(
            <div>
                <Flexbox name="drag-placeholder" container="column" justifyContent="center" alignItems="flex-start" className={containerClasses}>
                    <div>No things for {category.label.toLowerCase()}, drag things here.</div>
                </Flexbox>
            </div>
        )
    }
}

const style = {
    container: {
        height: 30,
        lineHeight: 1.5,
        color: '#aaa',
        letterSpacing: '0.025em'
    },
    hover: {
        border: `1px solid ${styleVars.highlightColor}`
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