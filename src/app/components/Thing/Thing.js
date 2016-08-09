const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const Delay = require('react-delay')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')
const classAutobind = require('class-autobind').default

const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const includes = require('lodash/includes')

const CommentList = require('../Comment/CommentList')
const ThingPageActionsBar = require('./ThingPageActionsBar')
const CommentThingBox = require('../MessageBox/CommentThingBox')

const Flexbox = require('../UI/Flexbox')
const TextTruncate = require('../UI/TextTruncate')
const Button = require('../UI/Button')
const styleVars = require('../style-vars')

const ThingPageActions = require('../../actions/thing-page-actions')

const EventTypes = require('../../../common/enums/event-types')
const {GeneralConstants, InvalidationStatus} = require('../../constants')

class Thing extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
        this.getThingUser = this.getThingUser.bind(this)
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

    getThingUser() {
        const {thing, currentUser} = this.props

        if (thing.creator.id === currentUser.id) {
            return thing.to.displayName
        }

        return thing.creator.displayName
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

    renderFetching() {
        const styles = this.getStyles()
        return (
            <Flexbox name="thing-content" grow={1} container="column" style={styles.thing}>
                <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                    <div className="thing-loading">
                        Loading thing, please wait.
                    </div>
                </Delay>
                <div className="thing-close">
                    <button onClick={this.close}>Back</button>
                </div>
            </Flexbox>
        )
    }

    renderError() {
        const styles = this.getStyles()
        return (
            <Flexbox name="thing-content" grow={1} container="column" style={styles.thing}>
                <div className="thing-error">
                    We are sorry, the thing could not be displayed!
                </div>
                <div className="thing-close">
                    <button onClick={this.close}>Back</button>
                </div>
            </Flexbox>
        )
    }

    renderContent() {
        const {thing} = this.props

        const comments = this.getAllComments()
        const createdAt = dateFns.format(thing.createdAt, 'DD-MM-YYYY HH:mm')

        const styles = this.getStyles()

        return (
            <Flexbox name="thing-content" grow={1} container="column" style={styles.thing}>
                    <Flexbox name="thing-header" style={styles.header}>
                        <Flexbox name="thing-header-row" container="row" alignItems="center" style={styles.headerRow}>
                            <Flexbox grow={1} container="row" style={{minWidth: 0}}>
                                <Flexbox name="thing-subject" style={styles.subject}>
                                    <TextTruncate>{thing.subject}</TextTruncate>
                                </Flexbox>
                                <Flexbox name="thing-status" style={styles.status}>
                                    ({thing.payload ? thing.payload.status : ''})
                                </Flexbox>
                            </Flexbox>
                            <Flexbox name="thing-actions">
                                <ThingPageActionsBar thing={thing} />
                            </Flexbox>
                            <Flexbox name="thing-close" style={styles.close}>
                                <Button label="Back" onClick={this.close} style={styles.button} />
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="thing-sub-header" style={styles.header}>
                        <Flexbox name="thing-header-row" container="row" alignItems="center">
                            <Flexbox name="thing-user" grow={1}>
                                {this.getThingUser()}
                            </Flexbox>
                            <Flexbox name="thing-creation-time">
                                {createdAt}
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="thing-body-container" grow={1} style={styles.content}>
                        <CommentList comments={comments} />
                    </Flexbox>
            </Flexbox>
        )
    }

    getStyles() {
        return {
            page: {
                height: '100%',
                padding: '35px 50px 20px 50px'
            },
            thing: {
                marginBottom: '15px'
            },
            header: {
                height: '40px',
                padding: '0 10px',
                backgroundColor: '#36474f',
                color: 'white'
            },
            headerRow: {
                height: '100%'
            },
            subject: {
                fontWeight: 'bold',
                minWidth: 0
            },
            status: {
                width: '150px',
                paddingLeft: '10px'
            },
            content: {
                height: '100%',
                overflowY: 'hidden',
                marginTop: '10px'
            },
            button: {
                backgroundColor: styleVars.secondaryColor,
                color: styleVars.primaryColor,
                ':hover': {
                    color: 'white'
                }
            }
        }
    }

    render() {
        const {thing} = this.props

        let content
        if (this.isFetching())
            content = this.renderFetching()
        else if (isEmpty(thing))
            content = this.renderError()
        else
            content = this.renderContent()

        const styles = this.getStyles()

        return (
            <DocumentTitle title={this.getTitle()}>
                <Flexbox name="thing-page" container="column" style={styles.page}>
                    {content}
                    <CommentThingBox />
                </Flexbox>
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