const React = require('react')
const {Component, PropTypes} = React
const Delay = require('react-delay')
const useSheet = require('react-jss').default

const isArray = require('lodash/isArray')

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
        const {noPreviews, sheet: {classes}} = this.props

        const texts = noPreviews.texts.map((text, index) => <span key={`text-${index}`} className={classes.noPreviewsText}>{text}</span>)

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end">
                <Flexbox name="preview-content" grow={1} container="column" justifyContent="center" alignItems="center">
                    <Flexbox container="column">
                        <span className={classes.noPreviewsLogo} style={{color: noPreviews.logoColor}}>***</span>
                        {texts}
                        <span className={classes.noPreviewsLogo} style={{color: noPreviews.logoColor}}>***</span>
                    </Flexbox>
                </Flexbox>
                <Flexbox container="column" alignSelf="center" className={classes.messagePanel}>
                    <MessagePanel />
                </Flexbox>
            </Flexbox>
        )
    }

    getPreviews() {
        const {previewItems, children, sheet: {classes}} = this.props

        // We use the children props to understand if we're in full-item mode or not.
        // The children arrive from the Router, and they would exist if the user navigated to a route that has a full-item in it.
        // Notice that when in full-item mode, we have two divs in absolute position, right next to another.
        // One of them acts as the blurry overlay of the background, and the other is the actual content of the full item.
        // The Message Panel, in this case, is included in the full item page, so that it appears above the overlay.

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end">
                <Flexbox name="preview-content" container="column" grow={1} style={{marginBottom: '15px'}}>
                    <Scrollable>
                        {previewItems}
                    </Scrollable>
                    {children ? <Flexbox name="full-item-blur" container="column" className={classes.blur} /> : null}
                    {children ? children : null}
                </Flexbox>
                {!children ?
                    <Flexbox container="column" alignSelf="center" className={classes.messagePanel}>
                        <MessagePanel />
                    </Flexbox> :
                    null}
            </Flexbox>
        )
    }

    render () {
        const {previewItems, invalidationStatus} = this.props

        if (invalidationStatus === InvalidationStatus.FETCHING)
            return this.getFetching()

        if (!previewItems || (isArray(previewItems) && !previewItems.length))
            return this.getNoPreviews()

        return this.getPreviews()
    }
}

const style = {
    blur: {
        height: '100%',
        backgroundColor: styleVars.secondaryBackgroundColor,
        '-webkit-filter': 'blur(50px)',
        filter: 'blur(50px)',
        position: 'absolute',
        top: -35,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: styleVars.fullItemBlurZIndex
    },
    noPreviewsText: {
        color: styleVars.watermarkColor,
        fontSize: '3em',
        marginBottom: 15,
        textAlign: 'center'
    },
    noPreviewsLogo: {
        fontSize: '1.4em',
        marginBottom: 15,
        textAlign: 'center'
    },
    messagePanel: {
        width: '100%',
        padding: [0, 40]
    }
}

PreviewsContainer.propTypes = {
    previewItems: PropTypes.any.isRequired,
    fetchPreviews: PropTypes.func.isRequired,
    noPreviews: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

module.exports = useSheet(PreviewsContainer, style)