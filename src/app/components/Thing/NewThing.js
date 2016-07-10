const React = require('react')
const {Component, PropTypes} = React

class NewThing extends Component {
    render () {
        const {thing} = this.props
        return (
            <div className="new-thing">
                <div className="thing-subject">
                    {thing.subject}
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