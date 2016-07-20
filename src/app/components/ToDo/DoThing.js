const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const dateFns = require('date-fns')
const {includes, sortBy, first, last} = require('lodash')

const CompleteThingActions = require('../../actions/complete-thing-actions')

class DoThing extends Component {
    constructor(props) {
        super(props)
        this.completeThing = this.completeThing.bind(this)
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

    completeThing() {
        this.props.completeThing(this.props.thing)
    }

    showThing() {
        this.props.router.push({
            pathname: `/tasks/${this.props.thing.id}`,
            query: {from: '/todo'}
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
            <div className="thing-unread-count">
                (+{this.unreadComments.length - 1})
            </div> : ''
        
        return (
            <div className="new-thing">
                <div className="thing-content">
                    <div className="thing-row">
                        <div className="thing-creator">
                            {thing.creator.email}
                        </div>
                        <div className="thing-subject">
                            <a onClick={this.showThing}>{thing.subject}</a>
                        </div>
                        <div className="thing-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="thing-row thing-body">
                        {content}
                    </div>
                    {unreadCount}
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
    thing: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        completeThing: (thing) => dispatch(CompleteThingActions.completeThing(thing))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withRouter(DoThing))