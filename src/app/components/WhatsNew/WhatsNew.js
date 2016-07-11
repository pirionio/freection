const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const NewThing = require('../Thing/NewThing')
const WhatsNewActions = require('../../actions/whats-new-actions')

class WhatsNew extends Component {
    componentDidMount () {
        this.props.fetchWhatsNew()
    }

    render () {
        const {things} = this.props
        const rows = things ? things.map(thing => <NewThing thing={thing} key={thing.id} />) : []
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