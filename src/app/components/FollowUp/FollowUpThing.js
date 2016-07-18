const React = require('react')
const {Component, PropTypes} = React
const {withRouter} = require('react-router')
const dateFns = require('date-fns')

class FollowUpThing extends Component {
    constructor(props) {
        super(props)
        this.showThing = this.showThing.bind(this)
    }

    showThing() {
        this.props.router.push({
            pathname: `/tasks/${this.props.thing.id}`,
            query: {from: '/followup'}
        })
    }

    render () {
        const {thing} = this.props
        const createdAt = dateFns.format(thing.createdAt, 'DD-MM-YYYY HH:mm')
        return (
            <div className="follow-up-thing">
                <div className="follow-up-thing-content">
                    <div className="follow-up-thing-row">
                        <div className="follow-up-thing-to">
                            {thing.to.email}
                        </div>
                        <div className="follow-up-thing-subject">
                            <a onClick={this.showThing}>{thing.subject}</a>
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

module.exports = withRouter(FollowUpThing)