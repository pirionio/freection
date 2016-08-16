const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const ActionsBar = require('../Actions/ActionsBar')
const {DoAction, DoneAction, DismissAction} = require('../Actions/Actions')

class ToDoActionsBar extends Component {
    render() {
        const {thing, currentUser, isRollover, preDoFunc} = this.props

        const actions = [
            DoAction(thing, currentUser),
            DoneAction(thing, currentUser),
            DismissAction(thing, currentUser, {preDoFunc})
        ]

        return <ActionsBar actions={actions} isRollover={isRollover} />
    }
}

ToDoActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isRollover: PropTypes.bool,
    preDoFunc: PropTypes.func
}

ToDoActionsBar.defaultProps = {
    isRollover: false
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(ToDoActionsBar)