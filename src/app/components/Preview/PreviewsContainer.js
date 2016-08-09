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

    getStyles() {
        return {
            container: {
                height: '100%',
                padding: '35px 50px 20px 50px'
            },
            list: {
                marginBottom: '15px'
            }
        }
    }

    render () {
        const {previewItems, noPreviewsText, invalidationStatus} = this.props
        const styles = this.getStyles()

        if (invalidationStatus === InvalidationStatus.FETCHING) {
            return (
                <div style={styles.container}>
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div>Loading, please wait...</div>
                    </Delay>
                </div>
            )
        }

        return (
            <Flexbox name="preview-container" container="column" style={styles.container}>
                <Flexbox name="preview-list-content" grow={1} container="column" style={styles.list}>
                    <Scrollable>
                        {previewItems && previewItems.length ? previewItems : <span>{noPreviewsText}</span>}
                    </Scrollable>
                </Flexbox>
                <Flexbox>
                    <NewMessageBox />
                </Flexbox>
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