import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import orderBy from 'lodash/orderBy'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import PreviewsContainer from '../Preview/PreviewsContainer'
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
        return orderBy(this.props.things, 'createdAt', 'desc').map(thing => {
            if (thing.type.key === EntityTypes.GITHUB.key) {
                return <GithubPreviewItem thing={thing} key={thing.id} />
            } else if (thing.type.key === EntityTypes.EMAIL_THING.key) {
                return <EmailThingPreviewItem thing={thing} key={thing.id} />
            }

            return <ToDoPreviewItem thing={thing} key={thing.id} />
        })
    }

    getNoPreviews() {
        return {
            texts: [
                'Nothing to do...',
                'Beware, they might fire you if it keeps going on like this.'
            ],
            logoColor: styleVars.baseBlueColor
        }
    }

    render() {
        const {invalidationStatus, sheet: {classes}} = this.props
        
        return (
            <Flexbox name="todo-container" grow={1} container="column" className={classes.container}>
                <PreviewsContainer previewItems={this.getThingsToDo()}
                                   fetchPreviews={this.fetchToDo}
                                   noPreviews={this.getNoPreviews()}
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
    things: PropTypes.array.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        things: state.toDo.things,
        invalidationStatus: state.toDo.invalidationStatus
    }
}

export default useSheet(connect(mapStateToProps)(ToDo), style)