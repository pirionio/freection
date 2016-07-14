const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const moment = require('moment')

const CompleteThingActions = require('../../actions/complete-thing-actions')

class DoThing extends Component {
    constructor(props) {
        super(props)
        this.completeThing = this.completeThing.bind(this)
    }

    completeThing() {
        this.props.completeThing(this.props.thing)
    }

    render () {
        const {thing} = this.props
        const createdAt = moment(thing.createdAt).format('DD-MM-YYYY HH:mm')
        return (
            <div className="new-thing">
                <div className="thing-content">
                    <div className="thing-row">
                        <div className="thing-creator">
                            {thing.creator.email}
                        </div>
                        <div className="thing-subject">
                            {thing.subject}
                        </div>
                        <div className="thing-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="thing-row thing-body">
                        {thing.body}
                    </div>
                </div>
                <div className="thing-actions">
                    <div className="thing-done">
                        <button onClick={this.completeThing}>Done</button>
                    </div>
                </div>
            </div>
        )
    }
}

DoThing.propTypes = {
    thing: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
    return {
        completeThing: (thing) => dispatch(CompleteThingActions.completeThing(thing))
    }
}

module.exports = connect(null, mapDispatchToProps)(DoThing)