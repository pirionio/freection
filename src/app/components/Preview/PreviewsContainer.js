const React = require('react')
const {Component, PropTypes} = React
const Delay = require('react-delay')
const radium = require('radium')

const isEmpty = require('lodash/isEmpty')

const {GeneralConstants, InvalidationStatus} = require('../../constants')

const Flexbox = require('../UI/Flexbox')
const MessagePanel = require('../MessageBox/MessagePanel')
const Scrollable = require('../Scrollable/Scrollable')
const styleVars = require('../style-vars')

class PreviewsContainer extends Component {
    componentDidMount () {
        this.props.fetchPreviews()
    }

    componentWillReceiveProps() {
        // Will fetch messages only if needed
        this.props.fetchPreviews()
    }

    getFetching() {
        return (
            <div>
                <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                    <div>Loading, please wait...</div>
                </Delay>
            </div>
        )
    }

    getNoPreviews() {
        const {noPreviews} = this.props
        const styles = this.getStyles()

        const texts = noPreviews.texts.map((text, index) => <span key={`text-${index}`} style={styles.noPreviews.text}>{text}</span>)

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end" style={styles.container}>
                <Flexbox name="preview-content" grow={1} container="column" justifyContent="center" alignItems="center">
                    <Flexbox container="column">
                        <span style={[styles.noPreviews.logo, {color: noPreviews.logoColor}]}>***</span>
                        {texts}
                        <span style={[styles.noPreviews.logo, {color: noPreviews.logoColor}]}>***</span>
                    </Flexbox>
                </Flexbox>
                <MessagePanel />
            </Flexbox>
        )
    }

    getPreviews() {
        const {previewItems, fullItemMode, children} = this.props
        const styles = this.getStyles()

        // When in full-item mode, we have two divs in absolute position, right next to another.
        // One of them acts as the blurry overlay of the background, and the other is the actual content of the full item.
        // The Message Panel, in this case, is included in the full item page, so that it appears above the overlay.

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end" style={styles.container}>
                <Flexbox name="preview-content" container="column" grow={1} style={{marginBottom: '15px'}}>
                    <Scrollable>
                        {previewItems}
                    </Scrollable>
                    {fullItemMode ? <Flexbox name="full-item-blur" container="column" style={styles.blur} /> : null}
                    {fullItemMode ? children : null}
                </Flexbox>
                {!fullItemMode ? <MessagePanel /> : null}
            </Flexbox>
        )
    }

    getStyles() {
        return {
            container: {
                position: 'relative'
            },
            blur: {
                height: '100%',
                backgroundColor: styleVars.secondaryBackgroundColor,
                filter: 'blur(50px)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: styleVars.fullItemBlurZIndex
            },
            noPreviews: {
                logo: {
                    fontSize: '1.4em',
                    marginBottom: '15px',
                    textAlign: 'center'
                },
                text: {
                    color: styleVars.watermarkColor,
                    fontSize: '3em',
                    marginBottom: '15px',
                    textAlign: 'center'
                }
            }
        }
    }

    render () {
        const {previewItems, invalidationStatus} = this.props

        if (invalidationStatus === InvalidationStatus.FETCHING)
            return this.getFetching()

        if (!previewItems || !previewItems.length)
            return this.getNoPreviews()

        return this.getPreviews()
    }
}

PreviewsContainer.propTypes = {
    previewItems: PropTypes.array.isRequired,
    fetchPreviews: PropTypes.func.isRequired,
    noPreviews: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired,
    fullItemMode: PropTypes.bool.isRequired
}

module.exports = radium(PreviewsContainer)