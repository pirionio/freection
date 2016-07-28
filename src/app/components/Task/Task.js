const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const DocumentTitle = require('react-document-title')
const dateFns = require('date-fns')

const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const includes = require('lodash/includes')

const CommentList = require('../Comment/CommentList')
const ActionBar = require('../Actions/ActionsBar')

const TaskActions = require('../../actions/task-actions')
const EventTypes = require('../../../common/enums/event-types')

class Task extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
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
                                <ActionBar thing={task} ping={false} />
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