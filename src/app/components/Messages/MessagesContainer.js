const React = require('react')
const {Component, PropTypes} = React
const ReactDOM = require('react-dom')

class MessagesContainer extends Component {
    componentDidMount () {
        this.props.fetchMessages()
    }

    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        this.props.fetchMessages()
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom) {
            let node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    render () {
        const messagesToShow = this.props.messages && this.props.messages.length ?
            this.props.getMessageRows() : this.props.noMessagesText

        return (
            <div className="messages-container">
                <div className="messages-content">
                    {messagesToShow}
                </div>
            </div>
        )
    }
}

MessagesContainer.propTypes = {
    messages: PropTypes.array.isRequired,
    fetchMessages: PropTypes.func.isRequired,
    getMessageRows: PropTypes.func.isRequired,
    noMessagesText: PropTypes.string.isRequired
}

module.exports = MessagesContainer