const React = require('react')
const {Component, PropTypes} = React
const moment = require('moment')

class FollowUpThing extends Component {
    constructor(props) {
        super(props)
    }

    render () {
        const {thing} = this.props
        const createdAt = moment(thing.createdAt).format('DD-MM-YYYY HH:mm')
        return (
            <div className="follow-up-thing">
                <div className="follow-up-thing-content">
                    <div className="follow-up-thing-row">
                        <div className="follow-up-thing-creator">
                            {thing.creator.email}
                        </div>
                        <div className="follow-up-thing-subject">
                            {thing.subject}
                        </div>
                        <div className="follow-up-thing-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="follow-up-thing-row follow-up-thing-body">
                        {thing.body}
                    </div>
                </div>
            </div>
        )
    }
}

FollowUpThing.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = FollowUpThing