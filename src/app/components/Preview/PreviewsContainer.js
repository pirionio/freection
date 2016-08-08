const React = require('react')
const {Component, PropTypes} = React
const Delay = require('react-delay')
const {GeneralConstants, InvalidationStatus} = require('../../constants')

const Flexbox = require('../UI/Flexbox')
const NewMessageBox = require('../MessageBox/NewMessageBox')

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
        const containerStyle = {
            height: '100%',
            padding: '35px 50px 20px 50px'
        }

        if (invalidationStatus === InvalidationStatus.FETCHING) {
            return (
                <div style={containerStyle}>
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div>Loading, please wait...</div>
                    </Delay>
                </div>
            )
        }

        return (
            <Flexbox container='column' style={containerStyle}>
                <Flexbox grow={1} container='column'>
                    {previewItems && previewItems.length ? previewItems : noPreviewsText}
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