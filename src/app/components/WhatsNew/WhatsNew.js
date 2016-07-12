const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

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

    render () {
        const {things} = this.props
        const rows = things && things.length ? things.map(thing => <NewThing thing={thing} key={thing.id} />) : 'There are no new Things'
        return (
            <div className="whats-new">
                {rows}
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