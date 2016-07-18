const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {withRouter} = require('react-router')
const dateFns = require('date-fns')
const {isEmpty} = require('lodash/core')

const TaskActions = require('../../actions/task-actions')

class Task extends Component {
    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
    }

    componentWillMount() {
        this.props.showFullTask(this.props.params.taskId)
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

    render() {
        const {task, isFetching} = this.props
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
                        {task.body}
                    </div>
                </div>
            </div>
        )
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        task: state.showTask.task,
        isFetching: state.showTask.isFetching,
        currentUser: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showFullTask: (taskId) => dispatch(TaskActions.showFullTask(taskId)),
        hideFullTask: (taskId) => dispatch(TaskActions.hideFullTask(taskId))
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withRouter(Task))