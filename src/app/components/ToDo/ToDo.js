import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import orderBy from 'lodash/orderBy'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import PreviewsContainer from '../Preview/PreviewsContainer'
import Placeholder from '../Preview/Placeholder'
import * as ToDoActions from '../../actions/to-do-actions'
import ToDoPreviewItem from './ToDoPreviewItem'
import EmailThingPreviewItem from './EmailThingPreviewItem'
import GithubPreviewItem from './GithubPreviewItem'
import EntityTypes from '../../../common/enums/entity-types'

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
        return orderBy(this.props.todos, 'thing.createdAt', 'desc').map(todo => {
            const {thing, commands} = todo

            if (thing.type.key === EntityTypes.GITHUB.key) {
                return <GithubPreviewItem thing={thing} commands={commands} key={thing.id} />
            } else if (thing.type.key === EntityTypes.EMAIL_THING.key) {
                return <EmailThingPreviewItem thing={thing} commands={commands} key={thing.id} />
            }

            return <ToDoPreviewItem thing={thing} commands={commands} key={thing.id} />
        })
    }

    getPlaceholder() {
        return (
            <Placeholder title="No tasks to do"
                         subTitle="Come to this page for all the tasks you need to work on." />
        )
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