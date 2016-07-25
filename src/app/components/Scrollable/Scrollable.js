const ReactDOM = require('react-dom')
const React = require('react')
const {Component, PropTypes} = React

class Scrollable extends Component {
    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom && this.props.stickToBottom) {
            let node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    scrollTo(id) {
        const element = this.refs[id]

        if (element) {
            const node = ReactDOM.findDOMNode(element)
            const container = ReactDOM.findDOMNode(this)

            if (container != node.offsetParent) {
                container.scrollTop = node.offsetTop - container.offsetTop
            } else {
                container.scrollTop = node.offsetTop
            }
        }
    }

    scrollToBottom() {
        const container = ReactDOM.findDOMNode(this)
        container.scrollTop = container.scrollHeight
    }

    render() {
        return <div style={{overflowY: 'auto', height: '100%'}}>
            {
                React.Children.map(this.props.children, element => {
                    return React.cloneElement(element, { ref: element.key })
                })
            }
        </div>
    }
}

Scrollable.propTypes = {
    children: PropTypes.node.isRequired,
    stickToBottom: PropTypes.bool
}

Scrollable.defaultProps = {
    stickToBottom: false
}

module.exports = Scrollable