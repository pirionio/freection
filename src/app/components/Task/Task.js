const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')
const {isEmpty, find} = require('lodash/core')

const CommentList = require('../Comment/CommentList')

const TaskActions = require('../../actions/task-actions')
const DoThingActions = require('../../actions/do-thing-actions')
const CompleteThingActions = require('../../actions/complete-thing-actions')

const TaskStatus = require('../../../common/enums/task-status')

class Task extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
        this.doTask = this.doTask.bind(this)
        this.completeTask = this.completeTask.bind(this)
    }

    componentWillMount() {
        this.props.showFullTask(this.props.params.taskId)
    }

    componentWillUnmount() {
        this.props.hideFullTask(this.props.params.taskId)
    }

    close() {
        this.props.router.push(this.props.location.query.from)
        this.props.hideFullTask(this.props.params.taskId)
    }

    getTaskReferencer() {
        const {task, currentUser} = this.props

        if (task.creator.email === currentUser.email) {
            return task.to.email
        }

        return task.creator.email
    }

    getActions() {
        const {task, notification} = this.props

        let actions = []

        if (task.payload.status === TaskStatus.NEW.key && !!notification && this.isCurrentUserTheTo()) {
            actions.push(
                <div className="task-action" key="action-do">
                    <button type="text" onClick={this.doTask}>Do</button>
                </div>
            )
        }

        if (task.payload.status === TaskStatus.INPROGRESS.key && this.isCurrentUserTheTo()) {
            actions.push(
                <div className="task-action" key="action-complete">
                    <button type="text" onClick={this.completeTask}>Done</button>
                </div>
            )
        }

        return actions
    }

    doTask() {
        console.log(this.props.notification)
        this.props.doThing(this.props.notification)
    }

    completeTask() {
        this.props.completeThing(this.props.task)
    }

    isCurrentUserTheTo() {
        return this.props.currentUser.email === this.props.task.to.email
    }

    getTitle() {
        const {task} = this.props

        const unreadComments = task.comments.filter(comment => !comment.payload.isRead)

        if (unreadComments.length > 0)
            return `(${unreadComments.length}) ${task.subject} - Freection`
        else
            return `${task.subject} - Freection`
    }

    render() {
        const {task, isFetching} = this.props
        const comments = task.comments
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
    currentUser: PropTypes.object.isRequired,
    notification: PropTypes.object
}

const mapStateToProps = (state, props) => {
    return {
        task: state.showTask.task,
        isFetching: state.showTask.isFetching,
        currentUser: state.auth,
        notification: props.location.query.messageId ?
            find(state.whatsNew.notifications, {id: props.location.query.messageId}) : {}
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showFullTask: (taskId) => dispatch(TaskActions.showFullTask(taskId)),
        hideFullTask: (taskId) => dispatch(TaskActions.hideFullTask(taskId)),
        doThing: (notification) => dispatch(DoThingActions.doThing(notification)),
        completeThing: (thing) => dispatch(CompleteThingActions.completeThing(thing))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withRouter(Task))