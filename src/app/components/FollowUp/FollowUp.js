const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')

const {GeneralConstants} = require('../../constants')
const FollowUpsActions = require('../../actions/follow-up-actions')
const FollowUpThing = require('./FollowUpThing')

class FollowUp extends Component {
    componentDidMount () {
        this.props.fetchFollowUps()
        setInterval(() => {
            this.props.fetchFollowUps()
        }, GeneralConstants.FETCH_INTERVAL_MILLIS)
    }

    render() {
        const rows = this.props.followUps && this.props.followUps.length ?
            this.props.followUps.map(thing => <FollowUpThing thing={thing} key={thing.id} />) :
            'There are no new Things to followup'

        return (
            <div className="follow-up-container">
                <div className="follow-up-content">
                    {rows}
                </div>
            </div>
        )
    }
}

FollowUp.propTypes = {
    followUps: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        followUps: state.followUps.followUps
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFollowUps: () => dispatch(FollowUpsActions.fetchFollowUps())
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(FollowUp)