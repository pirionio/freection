import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import groupBy from 'lodash/groupBy'
import keys from 'lodash/keys'

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
import Icon from 'react-fontawesome'

class ToDo extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)

        this.state = {
            collapseMap: {}
        }

        keys(TodoTimeCategory).forEach(categoryKey => {
            this.state.collapseMap[categoryKey] = false
        })
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
        const {sheet: {classes}} = this.props

        const todos = todosByTimeCategory[category.key]
        const isCollapsed = this.state.collapseMap[category.key]

        const todosSection = isCollapsed ? this.getCollapsedCategoryPlaceholder(category, todos) : this.buildToDoComponents(category, todos)

        return (
            <div name={`container-${category.key}`} key={`container-${category.key}`} className="clearfix">
                <div name="group-title" className={categoryClasses}>
                    <span>{category.label}</span>
                    <Icon name={isCollapsed ? 'angle-up' : 'angle-down'} className={classes.categoryCollapseIcon}
                          onClick={() => this.toggleCategoryCollapseMode(category)} />
                </div>
                {todosSection}
            </div>
        )
    }

    toggleCategoryCollapseMode(category) {
        const collapseMap = this.state.collapseMap
        collapseMap[category.key] = !this.state.collapseMap[category.key]
        this.setState({collapseMap})
    }

    buildToDoComponents(category, todos) {
        if (!todos || !todos.length)
            return this.getEmptyCategoryPlaceholder(category)

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

    getEmptyPagePlaceholder() {
        return (
            <Placeholder title="No tasks to do"
                         subTitle="Come to this page for all the tasks you need to work on." />
        )
    }

    getEmptyCategoryPlaceholder(category) {
        return (
            <PreviewGroupPlaceholder text="Nothing left to do here." icon="check-circle" category={category} moveToGroup={this.moveToGroup} />
        )
    }

    getCollapsedCategoryPlaceholder(category, todos) {
        const {sheet: {classes}} = this.props

        const text = todos.length === 1 ?
            `Click here to see the the task you have to do` :
            `Click here to see the the ${todos.length} tasks you have to do`

        return (
            <PreviewGroupPlaceholder text={text}
                                     moveToGroup={this.moveToGroup} onClick={() => this.toggleCategoryCollapseMode(category)}
                                     className={classes.categoryCollapsePlaceholder}/>
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
                                   getPlaceholder={this.getEmptyPagePlaceholder}
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
    },
    categoryCollapsePlaceholder: {
        cursor: 'pointer'
    },
    categoryCollapseIcon: {
        marginLeft: 10,
        cursor: 'pointer'
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