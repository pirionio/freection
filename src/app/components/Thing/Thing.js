const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const Delay = require('react-delay')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')

const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const includes = require('lodash/includes')

const CommentList = require('../Comment/CommentList')
const ThingPageActionsBar = require('./ThingPageActionsBar')

const ThingPageActions = require('../../actions/thing-page-actions')

const EventTypes = require('../../../common/enums/event-types')
const {GeneralConstants, InvalidationStatus} = require('../../constants')

class Thing extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
    }

    componentDidMount() {
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.get(params.thingId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hide())
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.get(params.thingId))
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getThingReferencer() {
        const {thing, currentUser} = this.props

        if (thing.creator.email === currentUser.email) {
            return thing.to.email
        }

        return thing.creator.email
    }

    getTitle() {
        const {thing} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `Freection (${unreadComments.length}) - ${thing.subject}`
        else
            return `Freection - ${thing.subject}`
    }

    getAllComments() {
        const {thing} = this.props
        return thing.events ?
            thing.events.filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key)) :
            []
    }

    getUnreadComments() {
        const {thing} = this.props
        return thing.events ?
            thing.events.filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key) && !event.payload.isRead) :
            []
    }

    isFetching() {
        return this.props.invalidationStatus === InvalidationStatus.FETCHING
    }

    render() {
        const {thing} = this.props
        const comments = this.getAllComments()
        const createdAt = dateFns.format(thing.createdAt, 'DD-MM-YYYY HH:mm')

        if (this.isFetching()) {
            return (
                <div className="thing-container">
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div className="thing-loading">
                            Loading thing, please wait.
                        </div>
                    </Delay>
                    <div className="thing-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        if (isEmpty(thing)) {
            return (
                <div className="thing-container">
                    <div className="thing-error">
                        We are sorry, the thing could not be displayed!
                    </div>
                    <div className="thing-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        return (
            <DocumentTitle title={this.getTitle()}>
                <div className="thing-container">
                    <div className="thing-header">
                        <div className="thing-title">
                            <div className="thing-subject">
                                {thing.subject}
                            </div>
                            <div className="thing-status">
                                ({thing.payload ? thing.payload.status : ''})
                            </div>
                            <div className="thing-close">
                                <button onClick={this.close}>Back</button>
                            </div>
                            <div className="thing-actions">
                                <ThingPageActionsBar thing={thing} />
                            </div>
                        </div>
                        <div className="thing-subtitle">
                            <div className="thing-referencer">
                                {this.getThingReferencer()}
                            </div>
                            <div className="thing-creation-time">
                                {createdAt}
                            </div>
                        </div>
                    </div>
                    <div className="thing-body-container">
                        <div className="thing-body-content">
                            <CommentList comments={comments} />
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}

Thing.propTypes = {
    thing: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thing: state.thingPage.thing,
        invalidationStatus: state.thingPage.invalidationStatus,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(Thing)