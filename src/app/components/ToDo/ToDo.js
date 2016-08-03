const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const {connect} = require('react-redux')
const sortBy = require('lodash/sortBy')

const MessagesContainer = require('../Messages/MessagesContainer')
const ToDoActions = require('../../actions/to-do-actions')
const ToDoPreviewItem = require('./ToDoPreviewItem')

class ToDo extends Component {
    constructor(props) {
        super(props)
        this.getThingsToDo = this.getThingsToDo.bind(this)
    }

    getThingsToDo() {
        return sortBy(this.props.things, 'createdAt').map(thing =>
            <ToDoPreviewItem thing={thing} key={thing.id} />)
    }

    getTitle() {
        if (this.props.things.length > 0)
            return `To Do (${this.props.things.length}) - Freection`
        else
            return 'To Do - Freection'
    }

    render() {
        return (
            <DocumentTitle title={this.getTitle()}>
                <MessagesContainer messages={this.props.things}
                                   fetchMessages={this.props.fetchToDo}
                                   getMessageRows={this.getThingsToDo}
                                   noMessagesText="There are no things to do" />
            </DocumentTitle>
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