const React = require('react')
const {Component, PropTypes} = React
const ReactDOM = require('react-dom')

class PreviewsContainer extends Component {
    componentDidMount () {
        this.props.fetchPreviews()
    }

    componentWillUpdate () {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        this.props.fetchPreviews()
    }

    componentDidUpdate () {
        if (this.shouldScrollBottom) {
            let node = ReactDOM.findDOMNode(this)
            node.scrollTop = node.scrollHeight
        }
    }

    render () {
        const {previewItems, noPreviewsText} = this.props

        return (
            <div className="previews-container">
                <div className="previews-content">
                    {previewItems && previewItems.length ? previewItems : noPreviewsText}
                </div>
            </div>
        )
    }
}

PreviewsContainer.propTypes = {
    previewItems: PropTypes.array.isRequired,
    fetchPreviews: PropTypes.func.isRequired,
    noPreviewsText: PropTypes.string.isRequired
}

module.exports = PreviewsContainer