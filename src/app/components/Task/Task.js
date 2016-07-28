const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')
const {goBack} = require('react-router-redux')

const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const includes = require('lodash/includes')


const CommentList = require('../Comment/CommentList')
const Action = require('../Messages/Action')

const ThingCommandActions = require('../../actions/thing-command-actions')
const ThingPageActions = require('../../actions/thing-page-actions')

const ThingStatus = require('../../../common/enums/thing-status')
const EventTypes = require('../../../common/enums/event-types')

class Task extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
        this.doTask = this.doTask.bind(this)
        this.dismissThing = this.dismissThing.bind(this)
        this.closeThing = this.closeThing.bind(this)
        this.abortThing = this.abortThing.bind(this)
        this.markThingAsDone = this.markThingAsDone.bind(this)
        this.pingThing = this.pingThing.bind(this)
    }

    componentWillMount() {
        const {dispatch, params} = this.props
        dispatch(ThingPageActions.get(params.taskId))
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch(ThingPageActions.hide())
    }

    close() {
        const {dispatch} = this.props
        dispatch(goBack())
    }

    getTaskReferencer() {
        const {task, currentUser} = this.props

        if (task.creator.email === currentUser.email) {
            return task.to.email
        }

        return task.creator.email
    }

    getActions() {
        const {task} = this.props

        let actions = []

        if (task.payload.status === ThingStatus.NEW.key && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Do" doFunc={this.doTask} key="action-Do" />
            )
        }

        if ((task.payload.status === ThingStatus.NEW.key ||
            task.payload.status === ThingStatus.INPROGRESS.key) && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Dismiss" doFunc={this.dismissThing} key="action-Dismiss" />
            )
        }

        if ((task.payload.status === ThingStatus.INPROGRESS.key || task.payload.status === ThingStatus.NEW.key) && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Done" doFunc={this.markThingAsDone} key="action-Done" />
            )
        }

        if (task.payload.status === ThingStatus.DONE.key && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Close" doFunc={this.closeThing} key="action-Close" />
            )
        }

        if ((task.payload.status == ThingStatus.INPROGRESS.key ||
            task.payload.status == ThingStatus.NEW.key) && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Abort" doFunc={this.abortThing} key="action-Abort" />
            )
        }

        if (task.payload.status === ThingStatus.INPROGRESS.key && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Ping" doFunc={this.pingThing} key="action-Ping" />
            )
        }

        return actions
    }

    doTask() {
        const {dispatch, task} = this.props
        dispatch(ThingCommandActions.doThing(task))
    }

    dismissThing() {
        const {dispatch, task} = this.props
        dispatch(ThingCommandActions.dismiss(task))
    }

    markThingAsDone() {
        const {dispatch, task} = this.props
        dispatch(ThingCommandActions.markAsDone(task))
    }

    closeThing() {
        const {dispatch, task} = this.props
        dispatch(ThingCommandActions.close(task))
    }

    abortThing() {
        const {dispatch, task} = this.props
        dispatch(ThingCommandActions.abort(task))
    }

    pingThing() {
        const {dispatch, task} = this.props
        dispatch(ThingCommandActions.ping(task))
    }

    isCurrentUserTheCreator() {
        return this.props.currentUser.id === this.props.task.creator.id
    }

    isCurrentUserTheTo() {
        return this.props.currentUser.email === this.props.task.to.email
    }

    getTitle() {
        const {task} = this.props

        const unreadComments = this.getUnreadComments()

        if (unreadComments.length > 0)
            return `(${unreadComments.length}) ${task.subject} - Freection`
        else
            return `${task.subject} - Freection`
    }

    getAllComments() {
        const {task} = this.props
        return task.events ?
            task.events.filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key)) :
            []
    }

    getUnreadComments() {
        const {task} = this.props
        return task.events ?
            task.events.filter(event => includes([EventTypes.COMMENT.key, EventTypes.PING.key], event.eventType.key) && !event.payload.isRead) :
            []
    }

    render() {
        const {task, isFetching} = this.props
        const comments = this.getAllComments()
        const createdAt = dateFns.format(task.createdAt, 'DD-MM-YYYY HH:mm')

        if (isFetching) {
            return (
                <div className="task-container">
                    <div className="task-loading">
                        Loading task, please wait.
                    </div>
                    <div className="task-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        if (isEmpty(task)) {
            return (
                <div className="task-container">
                    <div className="task-error">
                        We are sorry, the task could not be displayed!
                    </div>
                    <div className="task-close">
                        <button onClick={this.close}>Back</button>
                    </div>
                </div>
            )
        }

        const actions = this.getActions()

        return (
            <DocumentTitle title={this.getTitle()}>
                <div className="task-container">
                    <div className="task-header">
                        <div className="task-title">
                            <div className="task-subject">
                                {task.subject}
                            </div>
                            <div className="task-status">
                                ({task.payload ? task.payload.status : ''})
                            </div>
                            <div className="task-close">
                                <button onClick={this.close}>Back</button>
                            </div>
                            <div className="task-actions">
                                {actions}
                            </div>
                        </div>
                        <div className="task-subtitle">
                            <div className="task-referencer">
                                {this.getTaskReferencer()}
                            </div>
                            <div className="task-creation-time">
                                {createdAt}
                            </div>
                        </div>
                    </div>
                    <div className="task-body-container">
                        <div className="task-body-content">
                            <CommentList comments={comments} />
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        task: state.showTask.task,
        isFetching: state.showTask.isFetching,
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(Task)