const React = require('react')
const {Component, PropTypes} = React
const ReactDOM = require('react-dom')
const Delay = require('react-delay')
const {GeneralConstants, InvalidationStatus} = require('../../constants')

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
        const {previewItems, noPreviewsText, invalidationStatus} = this.props

        if (invalidationStatus === InvalidationStatus.FETCHING) {
            return (
                <div className="previews-container">
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div>Loading, please wait...</div>
                    </Delay>
                </div>
            )
        }

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
    noPreviewsText: PropTypes.string.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

module.exports = PreviewsContainer