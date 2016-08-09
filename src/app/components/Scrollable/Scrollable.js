const ReactDOM = require('react-dom')
const React = require('react')
const {Component, PropTypes} = React
const keys = require('lodash/keys')
const last = require('lodash/last')

class Scrollable extends Component {
    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom && this.props.stickToBottom) {
            this.scrollToBottom()
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
        const lastId = last(keys(this.refs))
        this.scrollTo(lastId)
    }

    render() {
        const childrenToRender = React.Children.map(this.props.children, element => {
            return React.cloneElement(element, {ref: element.key})
        })

        return (
            <div name="scrollable" style={{overflowY: 'auto', height: '100%'}}>
                {childrenToRender}
            </div>
        )
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
