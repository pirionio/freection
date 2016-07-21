const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {sortBy} = require('lodash/core')

const MessagesContainer = require('../Messages/MessagesContainer')
const ToDoActions = require('../../actions/to-do-actions')
const DoThing = require('./DoThing')

class ToDo extends Component {
    constructor(props) {
        super(props)
        this.getThingsToDo = this.getThingsToDo.bind(this)
    }

    getThingsToDo() {
        return sortBy(this.props.things, 'createdAt').map(thing =>
            <DoThing thing={thing} key={thing.id} />)
    }

    render() {
        return (
            <MessagesContainer messages={this.props.things}
                               fetchMessages={this.props.fetchToDo}
                               getMessageRows={this.getThingsToDo}
                               noMessagesText="There are no things to do" />
        )
    }
}

ToDo.propTypes = {
    things: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        things: state.toDo.things
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchToDo: () => dispatch(ToDoActions.fetchToDo())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ToDo)