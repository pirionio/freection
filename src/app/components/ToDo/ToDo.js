import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import groupBy from 'lodash/groupBy'

import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import Placeholder from '../Preview/Placeholder'
import PreviewGroupPlaceholder from '../Preview/PreviewGroupPlaceholder'
import * as ToDoActions from '../../actions/to-do-actions'
import ToDoPreviewItem from './ToDoPreviewItem'
import EmailThingPreviewItem from './EmailThingPreviewItem'
import GithubPreviewItem from './GithubPreviewItem'
import EntityTypes from '../../../common/enums/entity-types'
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

        const firstCategoryClass = classNames(classes.categoryHeader, classes.firstCategoryHeader)

        const todosByTimeCategory = groupBy(todos, todo => todo.thing.todoTimeCategory ? todo.thing.todoTimeCategory.key :
            SharedConstants.DEFAULT_TODO_TIME_CATEGORY.key)

        return [
            this.buildToDoSection(TodoTimeCategory.NEXT, todosByTimeCategory, firstCategoryClass),
            this.buildToDoSection(TodoTimeCategory.LATER, todosByTimeCategory, classes.categoryHeader),
            this.buildToDoSection(TodoTimeCategory.SOMEDAY, todosByTimeCategory, classes.categoryHeader)
        ]
    }

    buildToDoSection(category, todosByTimeCategory, categoryClasses) {
        const todos = todosByTimeCategory[category.key]

        return (
            <div name={`container-${category.key}`} key={`container-${category.key}`} className="clearfix">
                <div name="group-title" className={categoryClasses}>
                    {category.label}
                </div>
                {this.buildToDoComponents(category, todos)}
            </div>
        )
    }

    buildToDoComponents(category, todos) {
        if (!todos || !todos.length)
            return this.getDragPlaceholder(category)

        return todos.map(({thing, commands}, index) => {
            if (thing.type.key === EntityTypes.GITHUB.key)
                return <GithubPreviewItem thing={thing} commands={commands} key={thing.id} index={index}
                                          reorder={this.reorder} commitReorder={this.commitReorder}/>

            if (thing.type.key === EntityTypes.EMAIL_THING.key)
                return <EmailThingPreviewItem thing={thing} commands={commands} key={thing.id} index={index}
                                              reorder={this.reorder} commitReorder={this.commitReorder}/>

            return <ToDoPreviewItem thing={thing} commands={commands} key={thing.id} index={index}
                                    reorder={this.reorder} commitReorder={this.commitReorder} />
        })
    }

    getPlaceholder() {
        return (
            <Placeholder title="No tasks to do"
                         subTitle="Come to this page for all the tasks you need to work on." />
        )
    }

    getDragPlaceholder(category) {
        return (
            <PreviewGroupPlaceholder category={category} moveToGroup={this.moveToGroup} />
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
    categoryHeader: {
        color: '#515151',
        textTransform: 'uppercase',
        marginTop: 26,
        marginBottom: 13,
        marginLeft: 1
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