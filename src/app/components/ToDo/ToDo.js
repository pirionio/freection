import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import groupBy from 'lodash/groupBy'

import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import Placeholder from '../Preview/Placeholder'
import ToDoGroup from './ToDoGroup'
import * as ToDoActions from '../../actions/to-do-actions'
import TodoTimeCategory from '../../../common/enums/todo-time-category'
import SharedConstants from '../../../common/shared-constants'

class ToDo extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    fetchToDo() {
        const {dispatch} = this.props
        dispatch(ToDoActions.fetchToDo())
    }

    getThingsToDo() {
        const {todos, sheet: {classes}} = this.props

        const todosByTimeCategory = groupBy(todos, todo => {
            return todo.thing.todoTimeCategory ? todo.thing.todoTimeCategory.key : SharedConstants.DEFAULT_TODO_TIME_CATEGORY.key
        })

        const urgentTodos = todosByTimeCategory[TodoTimeCategory.URGENT.key]
        const hasUrgent = urgentTodos && urgentTodos.length

        const todosGroups = [
            this.createToDoGroup(TodoTimeCategory.NEXT, todosByTimeCategory, !hasUrgent ? classes.firstCategoryHeader : null),
            this.createToDoGroup(TodoTimeCategory.LATER, todosByTimeCategory),
            this.createToDoGroup(TodoTimeCategory.SOMEDAY, todosByTimeCategory)
        ]

        if (hasUrgent)
            todosGroups.unshift(this.createToDoGroup(TodoTimeCategory.URGENT, todosByTimeCategory, classes.firstCategoryHeader, false, false))

        return  todosGroups
    }

    createToDoGroup(category, todosByTimeCategory, className, allowDrop, allowDrag) {
        return <ToDoGroup key={`container-${category.key}`} category={category} todos={todosByTimeCategory[category.key]} className={className}
                          reorder={this.reorder} commitReorder={this.commitReorder} moveToGroup={this.moveToGroup}
                          allowDrop={allowDrop} allowDrag={allowDrag} />
    }

    getPlaceholder() {
        return (
            <Placeholder title="No tasks to do"
                         subTitle="Come to this page for all the tasks you need to work on." />
        )
    }

    reorder(draggedItemId, hoveredItemId) {
        const {dispatch} = this.props
        dispatch(ToDoActions.reorderDrag(draggedItemId, hoveredItemId))
    }

    commitReorder() {
        const {todos, dispatch} = this.props
        
        const thingIdsByCategory = {}

        todos.forEach(todo => {
            const categoryKey = todo.thing.todoTimeCategory ? todo.thing.todoTimeCategory.key : SharedConstants.DEFAULT_TODO_TIME_CATEGORY.key

            if (!thingIdsByCategory[categoryKey])
                thingIdsByCategory[categoryKey] = []

            thingIdsByCategory[categoryKey].push(todo.thing.id)
        })

        dispatch(ToDoActions.setTodos(thingIdsByCategory))
    }

    moveToGroup(draggedItemId, category) {
        const {dispatch} = this.props
        dispatch(ToDoActions.moveToGroup(draggedItemId, category))
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props

        return (
            <Flexbox name="todo-container" grow={1} container="column" className={classes.container}>
                <PreviewsContainer previewItems={this.getThingsToDo()}
                                   fetchPreviews={this.fetchToDo}
                                   getPlaceholder={this.getPlaceholder}
                                   invalidationStatus={invalidationStatus}>
                    {this.props.children}
                </PreviewsContainer>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        position: 'relative'
    },
    firstCategoryHeader: {
        marginTop: 0
    }
}

ToDo.propTypes = {
    todos: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        todos: state.toDo.todos,
        invalidationStatus: state.toDo.invalidationStatus
    }
}

export default useSheet(connect(mapStateToProps)(ToDo), style)