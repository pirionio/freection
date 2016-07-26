const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')
const {isEmpty, find} = require('lodash/core')

const CommentList = require('../Comment/CommentList')
const Action = require('../Messages/Action')

const TaskActions = require('../../actions/task-actions')
const DoThingActions = require('../../actions/do-thing-actions')
const DismissThingActions = require('../../actions/dismiss-thing-actions')
const MarkThingDoneActions = require('../../actions/mark-thing-done-actions')
const CloseThingActions = require('../../actions/close-thing-actions')
const AbortThingActions = require('../../actions/abort-thing-actions')

const TaskStatus = require('../../../common/enums/task-status')
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
    }

    componentWillMount() {
        const {dispatch, params} = this.props
        dispatch(TaskActions.showFullTask(params.taskId))
    }

    componentWillUnmount() {
        const {dispatch, params} = this.props
        dispatch(TaskActions.hideFullTask(params.taskId))
    }

    close() {
        this.props.router.push(this.props.location.query.from)
        const {dispatch, params} = this.props
        dispatch(TaskActions.hideFullTask(params.taskId))
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

        if (task.payload.status === TaskStatus.NEW.key && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Do" doFunc={this.doTask} key="action-Do" />
            )
        }

        if ((task.payload.status === TaskStatus.NEW.key ||
            task.payload.status === TaskStatus.INPROGRESS.key) && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Dismiss" doFunc={this.dismissThing} key="action-Dismiss" />
            )
        }

        if ((task.payload.status === TaskStatus.INPROGRESS.key || task.payload.status === TaskStatus.NEW.key) && this.isCurrentUserTheTo()) {
            actions.push(
                <Action label="Done" doFunc={this.markThingAsDone} key="action-Done" />
            )
        }

        if (task.payload.status == TaskStatus.DONE.key && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Close" doFunc={this.closeThing} key="action-Close" />
            )
        }

        if ((task.payload.status == TaskStatus.INPROGRESS.key ||
            task.payload.status == TaskStatus.NEW.key) && this.isCurrentUserTheCreator()) {
            actions.push(
                <Action label="Abort" doFunc={this.abortThing} key="action-Abort" />
            )
        }

        return actions
    }

    doTask() {
        const {dispatch, task} = this.props
        dispatch(DoThingActions.doThing(task))
    }

    dismissThing() {
        const {dispatch, task} = this.props
        dispatch(DismissThingActions.dismissThing(task))
    }

    markThingAsDone() {
        const {dispatch, task} = this.props
        dispatch(MarkThingDoneActions.markThingAsDone(task))
    }

    closeThing() {
        const {dispatch, task} = this.props
        dispatch(CloseThingActions.closeThing(task))
    }

    abortThing() {
        const {dispatch, task} = this.props
        dispatch(AbortThingActions.abortThing(task))
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
        return task.events ? task.events.filter(comment => comment.eventType.key === EventTypes.COMMENT.key) : []
    }

    getUnreadComments() {
        const {task} = this.props
        return task.events ? task.events.filter(comment => !comment.payload.isRead && comment.eventType.key === EventTypes.COMMENT.key) : []
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

module.exports = connect(mapStateToProps)(withRouter(Task))