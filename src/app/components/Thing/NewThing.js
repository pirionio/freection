const React = require('react')
const {Component, PropTypes} = React
const moment = require('moment')

class NewThing extends Component {

    render () {
        const {thing} = this.props
        const createdAt = moment(thing.createdAt).format('DD-MM-YYYY HH:mm')
        return (
            <div className="new-thing">
                <div className="metadata-row">
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
                <div className="thing-body">
                    {thing.body}
                </div>
            </div>
        )
    }
}

NewThing.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = NewThing