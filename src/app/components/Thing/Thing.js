const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')
const classAutobind = require('class-autobind').default

const isEmpty = require('lodash/isEmpty')

const ThingPageActionsBar = require('./ThingPageActionsBar')
const NewMessagePanel = require('../MessageBox/NewMessagePanel')

const {FullItem, FullItemSubject, FullItemStatus, FullItemActions, FullItemUser, FullItemDate, FullItemBox} = require('../Full/FullItem')
const TextTruncate = require('../UI/TextTruncate')

const ThingPageActions = require('../../actions/thing-page-actions')

const EventTypes = require('../../../common/enums/event-types')
const {InvalidationStatus} = require('../../constants')

class Thing extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Thing.prototype)
    }

    componentDidMount() {
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.getThing(params.thingId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hideThingPage())
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.getThing(params.thingId))
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getThingUser() {
        const {thing, currentUser} = this.props

        if (this.isEmpty())
            return ''

        if (thing.creator.id === currentUser.id)
            return thing.to.displayName

        return thing.creator.displayName
    }

    getDocumentTitle() {
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
            thing.events.filter(event => [EventTypes.COMMENT.key, EventTypes.PING.key].includes(event.eventType.key)) :
            []
    }

    getUnreadComments() {
        const {thing} = this.props
        return thing.events ?
            thing.events.filter(event => [EventTypes.COMMENT.key, EventTypes.PING.key].includes(event.eventType.key) && !event.payload.isRead) :
            []
    }

    isFetching() {
        return this.props.invalidationStatus === InvalidationStatus.FETCHING
    }
    
    isEmpty() {
        return isEmpty(this.props.thing)
    }

    render() {
        const {thing} = this.props

        return (
            <DocumentTitle title={this.getDocumentTitle()}>
                <FullItem messages={this.getAllComments()} close={this.close} isFetching={this.isFetching} isEmpty={this.isEmpty}>
                    <FullItemSubject>
                        <TextTruncate style={{fontWeight: 'bold'}}>{thing.subject}</TextTruncate>
                    </FullItemSubject>
                    <FullItemStatus>
                        <span>({thing.payload ? thing.payload.status : ''})</span>
                    </FullItemStatus>
                    <FullItemActions>
                        <ThingPageActionsBar thing={thing} />
                    </FullItemActions>
                    <FullItemUser>
                        <span>{this.getThingUser()}</span>
                    </FullItemUser>
                    <FullItemDate>
                        <span>{dateFns.format(thing.createdAt, 'DD-MM-YYYY HH:mm')}</span>
                    </FullItemDate>
                    <FullItemBox>
                        <NewMessagePanel />
                    </FullItemBox>
                </FullItem>
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