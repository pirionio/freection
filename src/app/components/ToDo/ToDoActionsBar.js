import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ActionsBar from '../Actions/ActionsBar'
import {DoAction, DoneAction, DismissAction} from '../Actions/Actions'

class ToDoActionsBar extends Component {
    render() {
        const {thing, currentUser, preDoFunc} = this.props

        const actions = [
            DoAction(thing, currentUser),
            DoneAction(thing, currentUser, {preDoFunc}),
            DismissAction(thing, currentUser, {preDoFunc})
        ]

        return <ActionsBar actions={actions} />
    }
}

ToDoActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    preDoFunc: PropTypes.func
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default connect(mapStateToProps)(ToDoActionsBar)