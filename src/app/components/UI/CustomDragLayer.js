import React, {Component, PropTypes} from 'react'
import {DragLayer} from 'react-dnd'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import {DragItemTypes} from '../../constants'
import styleVars from '../style-vars'

class CustomDragLayer extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CustomDragLayer.prototype)
    }

    renderItem() {
        const {itemType, sheet: {classes}} = this.props

        switch (itemType) {
            case DragItemTypes.PREVIEW_CARD:
                return (
                    <div className={classes.previewItem} />
                )
            default:
                return null
        }
    }

    getItemStyles() {
        const {initialOffset, currentOffset} = this.props

        if (!initialOffset || !currentOffset) {
            return {
                display: 'none'
            }
        }

        const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`
        return {
            transform: transform,
            WebkitTransform: transform
        }
    }

    render() {
        const {isDragging, sheet: {classes}} = this.props

        if (!isDragging) {
            return null
        }

        return (
            <div className={classes.layer}>
                <div style={this.getItemStyles()}>
                    {this.renderItem()}
                </div>
            </div>
        )
    }
}

const style = {
    layer: {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    previewItem: {
        height: 50,
        width: 400,
        backgroundColor: styleVars.secondaryBackgroundColor,
        border: `1px solid ${styleVars.baseBorderColor}`,
        opacity: 0.4
    }
}

CustomDragLayer.propTypes = {
    itemType: PropTypes.string,
    isDragging: PropTypes.bool.isRequired,
    initialOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })
}

function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }
}

export default useSheet(DragLayer(collect)(CustomDragLayer), style)