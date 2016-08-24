const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const DocumentTitle = require('react-document-title')

const isEmpty = require('lodash/isEmpty')
const reject = require('lodash/reject')

const ThingPageActionsBar = require('./ThingPageActionsBar')
const MessagePanel = require('../MessageBox/MessagePanel')
const {FullItem, FullItemSubject, FullItemStatus, FullItemActions, FullItemBox} = require('../Full/FullItem')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

const ThingPageActions = require('../../actions/thing-page-actions')
const ThingHelper = require('../../helpers/thing-helper')

const EventTypes = require('../../../common/enums/event-types')
const ThingStatus = require('../../../common/enums/thing-status')
const {InvalidationStatus} = require('../../constants')

class FullThing extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, FullThing.prototype)
    }

    componentDidMount() {
        const {dispatch, thing} = this.props
        dispatch(ThingPageActions.getThing(thing.id))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hideThingPage())
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        const {dispatch, thing} = this.props
        dispatch(ThingPageActions.getThing(thing.id))
    }

    close() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hideThingPage())
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

        // Filter out CREATED events that have no text - since we allow creating a new Thing with no body at all.
        return thing.events ?
            reject(ThingHelper.getAllMessages(thing), message => !message.payload.text) :
            []
    }

    getUnreadComments() {
        const {thing} = this.props
        return thing.events ? ThingHelper.getUnreadMessages(thing) : []
    }

    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
            case ThingStatus.NEW.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.INPROGRESS.key:
                return styleVars.yellowCircleColor
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
            case ThingStatus.CLOSE.key:
                return styleVars.greyCircleColor
            default:
                return 'black'
        }
    }

    isFetching() {
        return this.props.invalidationStatus === InvalidationStatus.FETCHING
    }

    isEmpty() {
        return isEmpty(this.props.thing)
    }

    getStyles() {
        return {
            page: {
                height: '100%',
                zIndex: styleVars.fullItemZIndex
            },
            item: {
                backgroundColor: styleVars.secondaryBackgroundColor
            }
        }
    }

    render() {
        const {thing} = this.props
        return (
            <DocumentTitle title={this.getDocumentTitle()}>
                <FullItem messages={this.getAllComments()} close={this.close} isFetching={this.isFetching} isEmpty={this.isEmpty} 
                          circleColor={this.getCircleColor()}>
                    <FullItemSubject>
                        <span>{thing.subject}</span>
                    </FullItemSubject>
                    <FullItemStatus>
                        <span>({thing.payload ? thing.payload.status : ''})</span>
                    </FullItemStatus>
                    <FullItemActions>
                        <ThingPageActionsBar thing={thing} />
                    </FullItemActions>
                    <FullItemBox>
                        <MessagePanel />
                    </FullItemBox>
                </FullItem>
            </DocumentTitle>
        )
    }
}

FullThing.propTypes = {
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

module.exports = connect(mapStateToProps)(FullThing)