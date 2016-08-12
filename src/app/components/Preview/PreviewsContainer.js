const React = require('react')
const {Component, PropTypes} = React
const Delay = require('react-delay')
const {GeneralConstants, InvalidationStatus} = require('../../constants')

const Flexbox = require('../UI/Flexbox')
const NewMessageBox = require('../MessageBox/NewMessageBox')
const Scrollable = require('../Scrollable/Scrollable')

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
                <div>
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div>Loading, please wait...</div>
                    </Delay>
                </div>
            )
        }

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end">
                <Flexbox name="preview-content" container="column" grow={1} style={{marginBottom: '15px'}}>
                    <Scrollable>
                        {previewItems && previewItems.length ? previewItems : <span>{noPreviewsText}</span>}
                    </Scrollable>
                </Flexbox>
                <NewMessageBox />
            </Flexbox>
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