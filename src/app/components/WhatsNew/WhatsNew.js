const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {sortBy} = require('lodash')
const ReactDOM = require('react-dom')

const {GeneralConstants} = require('../../constants')
const NewThing = require('../Thing/NewThing')
const WhatsNewActions = require('../../actions/whats-new-actions')

class WhatsNew extends Component {
    componentDidMount () {
        this.props.fetchWhatsNew()
        setInterval(() => {
            this.props.fetchWhatsNew()
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

    sortThingsByDate () {
        return sortBy(this.props.things, thing => thing.createdAt)
    }

    render () {
        const rows = this.props.things && this.props.things.length ?
            this.sortThingsByDate().map(thing => <NewThing thing={thing} key={thing.id} />) :
            'There are no new Things'
        return (
            <div className="whats-new-container">
                <div className="whats-new-content">
                    {rows}
                </div>
            </div>
        )
    }
}

WhatsNew.propTypes = {
    things: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        things: state.whatsNew.things,
        isFetching: state.whatsNew.isFetching
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchWhatsNew: () => dispatch(WhatsNewActions.fetchWhatsNew())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(WhatsNew)