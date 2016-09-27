import ReactDOM from 'react-dom'
import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import {Element, scroller} from 'react-scroll'
import keys from 'lodash/keys'
import last from 'lodash/last'
import random from 'lodash/random'

import Flexbox from '../UI/Flexbox'

class Scrollable extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Scrollable.prototype)

        this.state = {
            containerId: `scrollable-conntent-${random(Number.MAX_SAFE_INTEGER)}`
        }
    }

    componentWillReceiveProps () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentDidMount() {
        this.checkScroll()
    }

    componentDidUpdate () {
        this.checkScroll()
    }

    checkScroll() {
        const {getScrollToElementId} = this.props

        if (this.shouldScrollBottom && this.props.stickToBottom) {
            this.scrollToBottom()
        } else if (getScrollToElementId) {
            this.scrollTo(getScrollToElementId())
        }
    }

    scrollTo(id) {
        scroller.scrollTo(id, {
            containerId: this.state.containerId
        })
    }

    scrollToBottom() {
        const lastId = last(keys(this.refs))
        this.scrollTo(lastId)
    }

    render() {
        const childrenToRender = React.Children.map(this.props.children, element => {
            return (
                // Name is needed in order to react-scroll to recognize this element.
                // Ref is needed in order for us to be able to reference all elements, and find specific ones in them (like the last one).
                <Element name={element.key} ref={element.key}>
                    {element}
                </Element>
            )
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
                <Flexbox name="scrollable-content" style={style.content} id={this.state.containerId}>
                    {childrenToRender}
                </Flexbox>
            </Flexbox>
        )
    }
}

Scrollable.propTypes = {
    children: PropTypes.node.isRequired,
    stickToBottom: PropTypes.bool,
    getScrollToElementId: PropTypes.func
}

Scrollable.defaultProps = {
    stickToBottom: false
}

export default Scrollable
