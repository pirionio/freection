const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DoAction, DoneAction, DismissAction} = require('../Actions/Actions')

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

module.exports = connect(mapStateToProps)(ToDoActionsBar)