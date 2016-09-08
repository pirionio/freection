import ReactDOM from 'react-dom'
import React, {Component, PropTypes} from 'react'
import keys from 'lodash/keys'
import last from 'lodash/last'

import Flexbox from '../UI/Flexbox'

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

            if (container !== node.offsetParent) {
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

        // We must not use JSS here, because it's used with a decorator,
        // and using a decorator disables us from calling methods of this component from outside.
        const style = {
            container: {
                position: 'relative',
                overflowY: 'hidden'
            },
            content: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                overflowY: 'auto'
            }
        }

        return (
            <Flexbox name="scrollable-container" container="column" grow={1} style={style.container}>
                <Flexbox name="scrollable-content" style={style.content}>
                    {childrenToRender}
                </Flexbox>
            </Flexbox>
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

export default Scrollable
