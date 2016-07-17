const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const dateFns = require('date-fns')

const DoThingActions = require('../../actions/do-thing-actions')

class NewNotification extends Component {
    constructor(props) {
        super(props)
        this.doThing = this.doThing.bind(this)
        this.doneActionEnabled = this.doneActionEnabled.bind(this)
    }

    doThing() {
        this.props.doThing(this.props.notification)
    }

    doneActionEnabled() {
        return this.props.notification.type.key !== 'DONE'
    }
    
    render () {
        const {notification} = this.props
        const createdAt = dateFns.format(notification.createdAt, 'DD-MM-YYYY HH:mm')

        const doneAction = this.doneActionEnabled() ?
            <div className="notification-do">
                <button onClick={this.doThing}>Do</button>
            </div> : ''

        return (
            <div className="new-notification">
                <div className="notification-content">
                    <div className="notification-row">
                        <div className="notification-creator">
                            {notification.creator.email}
                        </div>
                        <div className="notification-subject">
                            {notification.subject}
                        </div>
                        <div className="notification-type">
                            ({notification.type.label})
                        </div>
                        <div className="notification-creation-time">
                            {createdAt}
                        </div>
                    </div>
                    <div className="notification-row notification-body">
                        {notification.body}
                    </div>
                </div>
                <div className="notification-actions">
                    {doneAction}
                </div>
            </div>
        )
    }
}

NewNotification.propTypes = {
    notification: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
    return {
        doThing: (notification) => dispatch(DoThingActions.doThing(notification))
    }
}

module.exports = connect(null, mapDispatchToProps)(NewNotification)