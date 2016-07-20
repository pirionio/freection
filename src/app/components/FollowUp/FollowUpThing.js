const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const dateFns = require('date-fns')
const {includes, sortBy, first, last} = require('lodash')

class FollowUpThing extends Component {
    constructor(props) {
        super(props)
        this.showThing = this.showThing.bind(this)
        this.initComments = this.initComments.bind(this)
    }

    componentWillMount() {
        this.initComments()
    }

    componentWillUpdate() {
        this.initComments()
    }

    initComments() {
        const {thing, currentUser} = this.props
        this.unreadComments = sortBy(thing.comments.filter(comment => includes(comment.readList, currentUser.id)), 'createdAt')
        this.readComments = sortBy(thing.comments.filter(comment => !includes(comment.readList, currentUser.id)), 'createdAt')
    }

    showThing() {
        this.props.router.push({
            pathname: `/tasks/${this.props.thing.id}`,
            query: {from: '/followup'}
        })
    }

    getMessagePreview() {
        const {thing} = this.props

        // If there are unread comments, show the first of them.
        if (this.unreadComments && this.unreadComments.length) {
            return first(this.unreadComments).payload.text
        }

        // If there are only read comments, show the last of them.
        if (this.readComments && this.readComments.length) {
            return last(this.readComments).payload.text
        }

        return thing.body
    }

    render () {
        const {thing} = this.props

        const createdAt = dateFns.format(thing.createdAt, 'DD-MM-YYYY HH:mm')
        const content = this.getMessagePreview()

        const unreadCount = this.unreadComments && this.unreadComments.length > 1 ?
            <div className="follow-up-thing-unread-count">
                (+{this.unreadComments.length - 1})
            </div> : ''

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
                    <div className="follow-up-thing-row">
                        <div className="follow-up-thing-text">
                            {content}
                        </div>
                        {unreadCount}
                    </div>
                </div>
            </div>
        )
    }
}

FollowUpThing.propTypes = {
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(withRouter(FollowUpThing))