const React = require('react')
const {Component, PropTypes} = React
const DocumentTitle = require('react-document-title')
const {connect} = require('react-redux')
const orderBy = require('lodash/orderBy')
const classAutobind = require('class-autobind').default

const PreviewsContainer = require('../Preview/PreviewsContainer')
const ToDoActions = require('../../actions/to-do-actions')
const ToDoPreviewItem = require('./ToDoPreviewItem')

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
        return orderBy(this.props.things, 'createdAt', 'desc').map(thing =>
            <ToDoPreviewItem thing={thing} key={thing.id} />)
    }

    getTitle() {
        if (this.props.things.length > 0)
            return `Freection (${this.props.things.length}) - To Do`
        else
            return 'Freection - To Do'
    }

    render() {
        const {invalidationStatus} = this.props
        
        return (
            <DocumentTitle title={this.getTitle()}>
                <PreviewsContainer previewItems={this.getThingsToDo()}
                                   fetchPreviews={this.fetchToDo}
                                   noPreviewsText="There are no things to do"
                                   invalidationStatus={invalidationStatus} />
            </DocumentTitle>
        )
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

module.exports = connect(mapStateToProps)(ToDo)