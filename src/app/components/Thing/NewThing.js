const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const moment = require('moment')

const DoThingActions = require('../../actions/do-thing-actions')

class NewThing extends Component {

    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
    }

    doThing() {
        this.props.doThing(this.props.thing)
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
                    <div className="thing-do">
                        <button onClick={this.doThing}>Do</button>
                    </div>
                </div>
            </div>
        )
    }
}

NewThing.propTypes = {
    thing: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
    return {
        doThing: (thing) => dispatch(DoThingActions.doThing(thing))
    }
}

module.exports = connect(null, mapDispatchToProps)(NewThing)