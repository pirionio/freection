const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {sortBy} = require('lodash')
const ReactDOM = require('react-dom')

const {GeneralConstants} = require('../../constants')
const ToDoActions = require('../../actions/to-do-actions')
const DoThing = require('./DoThing')

class ToDo extends Component {
    componentDidMount () {
        this.props.fetchToDo()
        this.fetchInterval = setInterval(() => {
            this.props.fetchToDo()
        }, GeneralConstants.FETCH_INTERVAL_MILLIS)
    }

    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom) {
            let node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    componentWillUnmount () {
        clearInterval(this.fetchInterval)
    }

    sortThingsByDate () {
        return sortBy(this.props.things, thing => thing.createdAt)
    }

    render () {
        const rows = this.props.things && this.props.things.length ?
            this.sortThingsByDate().map(thing => <DoThing thing={thing} key={thing.id} />) :
            'There are no Things to do'
        return (
            <div className="to-do-container">
                <div className="to-do-content">
                    {rows}
                </div>
            </div>
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