const React = require('react')
const {Component, PropTypes} = React
const Delay = require('react-delay')
const {GeneralConstants, InvalidationStatus} = require('../../constants')

class PreviewsContainer extends Component {
    componentDidMount () {
        this.props.fetchPreviews()
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        this.props.fetchPreviews()
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