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
        const {text, icon, connectDropTarget, className, onClick, sheet: {classes}} = this.props

        const containerClasses = classNames(classes.container, className)

        return connectDropTarget(
            <div>
                <Flexbox name="drag-placeholder" container="row" alignItems="center" className={containerClasses} onClick={onClick}>
                    {icon ? <Icon name={icon} className={classes.icon} /> : null}
                    <span>{text}</span>
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
        border: `1px solid ${styleVars.baseBorderColor}`,
        padding: [0, 15]
    },
    icon: {
        marginRight: 15
    }
}

PreviewGroupPlaceholder.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func
}

const dropTarget = {
    hover(props, monitor) {
        const draggedItemId = monitor.getItem().entityId
        const category = props.category

        if (category)
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