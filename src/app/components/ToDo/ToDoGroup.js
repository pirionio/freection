import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import {DropTarget} from 'react-dnd'
import Icon from 'react-fontawesome'
import isNil from 'lodash/isNil'

import ToDoPreviewItem from './ToDoPreviewItem'
import EmailThingPreviewItem from './EmailThingPreviewItem'
import ExternalPreviewItem from './ExternalPreviewCard'
import PreviewGroupPlaceholder from '../Preview/PreviewGroupPlaceholder'
import EntityTypes from '../../../common/enums/entity-types'
import {DragItemTypes} from '../../constants'

class ToDoGroup extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ToDoGroup.prototype)

        this.state = {
            isCollapsed: false
        }
    }

    buildToDoComponents() {
        const {todos, reorder, commitReorder, allowDrop, allowDrag} = this.props

        if (!todos || !todos.length)
            return this.getEmptyCategoryPlaceholder()

        return todos.map(({thing, commands}, index) => {
            if ([EntityTypes.GITHUB.key, EntityTypes.EXTERNAL.key].includes(thing.type.key))
                return <ExternalPreviewItem thing={thing} commands={commands} key={thing.id} index={index}
                                            allowDrag={allowDrag} allowDrop={allowDrop}
                                            reorder={reorder} commitReorder={commitReorder} />

            if (thing.type.key === EntityTypes.EMAIL_THING.key)
                return <EmailThingPreviewItem thing={thing} commands={commands} key={thing.id} index={index}
                                              allowDrag={allowDrag} allowDrop={allowDrop}
                                              reorder={reorder} commitReorder={commitReorder} />

            return <ToDoPreviewItem thing={thing} commands={commands} key={thing.id} index={index}
                                    allowDrag={allowDrag} allowDrop={allowDrop}
                                    reorder={reorder} commitReorder={commitReorder} />
        })
    }

    getEmptyCategoryPlaceholder() {
        const {category, moveToGroup} = this.props

        return (
            <PreviewGroupPlaceholder text="Drag tasks here." icon="check-circle" category={category} moveToGroup={moveToGroup} />
        )
    }

    getCollapsedCategoryPlaceholder() {
        const {todos, moveToGroup, sheet: {classes}} = this.props

        const text = todos.length === 1 ?
            `Click here to see the the task you have to do` :
            `Click here to see the the ${todos.length} tasks you have to do`

        return (
            <PreviewGroupPlaceholder text={text}
                                     moveToGroup={moveToGroup} onClick={this.toggleCategoryCollapseMode}
                                     className={classes.collapsedPlaceholder}/>
        )
    }

    toggleCategoryCollapseMode() {
        if (this.hasTodos()) {
            this.setState({
                isCollapsed: !this.state.isCollapsed
            })
        }
    }

    hasTodos() {
        return this.props.todos && this.props.todos.length
    }

    render() {
        const {category, allowDrop, connectDropTarget, isOver, className, sheet: {classes}} = this.props

        const todosSection = this.state.isCollapsed ? this.getCollapsedCategoryPlaceholder() : this.buildToDoComponents()
        const titleIcon = this.hasTodos() ?
            <Icon name={this.state.isCollapsed ? 'angle-up' : 'angle-down'} className={classes.collapseIcon} /> :
            null

        const containerClass = classNames('clearfix', isOver && !allowDrop ? classes.dropNotAllowed : null)
        const titleClass = classNames(classes.header, className, 'js-header')

        return connectDropTarget(
            <div name={`container-${category.key}`} className={containerClass}>
                <div name="group-title" className={titleClass}>
                    <span className={this.hasTodos() ? classes.headerWhenCollapsible : ''} onClick={this.toggleCategoryCollapseMode}>
                        {category.label}
                        {titleIcon}
                    </span>
                </div>
                {todosSection}
            </div>
        )
    }
}

ToDoGroup.propTypes = {
    category: PropTypes.object.isRequired,
    todos: PropTypes.array,
    reorder: PropTypes.func.isRequired,
    commitReorder: PropTypes.func.isRequired,
    moveToGroup: PropTypes.func.isRequired,
    className: PropTypes.string,
    allowDrop: PropTypes.bool,
    allowDrag: PropTypes.bool
}

ToDoGroup.defaultProps = {
    allowDrop: true,
    allowDrag: true
}

const style = {
    dropNotAllowed: {
        cursor: 'not-allowed'
    },
    header: {
        color: '#515151',
        textTransform: 'uppercase',
        marginTop: 26,
        marginBottom: 13,
        marginLeft: 1
    },
    headerWhenCollapsible: {
        cursor: 'pointer'
    },
    collapsedPlaceholder: {
        cursor: 'pointer'
    },
    collapseIcon: {
        marginLeft: 10
    }
}

const dropTarget = {
    hover(props, monitor) {
        if (!isNil(props.allowDrop) && !props.allowDrop)
            return

        const draggedItemId = monitor.getItem().entityId
        const category = props.category
        if (category)
            props.moveToGroup(draggedItemId, category)
    },

    canDrop(props) {
        return isNil(props.allowDrop) || !!props.allowDrop
    }
}

function collectDropOn(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

export default useSheet(DropTarget(DragItemTypes.PREVIEW_CARD, dropTarget, collectDropOn)(ToDoGroup), style)