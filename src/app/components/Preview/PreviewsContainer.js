const React = require('react')
const {Component, PropTypes} = React
const Delay = require('react-delay')
const radium = require('radium')

const {GeneralConstants, InvalidationStatus} = require('../../constants')

const Flexbox = require('../UI/Flexbox')
const NewMessagePanel = require('../MessageBox/NewMessagePanel')
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

    getNoPreviews() {
        const {noPreviews} = this.props
        const styles = this.getStyles()

        const texts = noPreviews.texts.map((text, index) => <span key={`text-${index}`} style={styles.noPreviews.text}>{text}</span>)

        return (
            <Flexbox container="column">
                <span style={[styles.noPreviews.logo, {color: noPreviews.logoColor}]}>***</span>
                {texts}
                <span style={[styles.noPreviews.logo, {color: noPreviews.logoColor}]}>***</span>
            </Flexbox>
        )
    }

    getStyles() {
        return {
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

        if (invalidationStatus === InvalidationStatus.FETCHING) {
            return (
                <div>
                    <Delay wait={GeneralConstants.FETCHING_DELAY_MILLIS}>
                        <div>Loading, please wait...</div>
                    </Delay>
                </div>
            )
        }

        if (!previewItems || !previewItems.length) {
            return (
                <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end">
                    <Flexbox name="preview-content" grow={1} container="column" justifyContent="center" alignItems="center">
                        {this.getNoPreviews()}
                    </Flexbox>
                    <NewMessagePanel />
                </Flexbox>
            )
        }

        return (
            <Flexbox name="preview-container" grow={1} container="column" justifyContent="flex-end">
                <Flexbox name="preview-content" container="column" grow={1} style={{marginBottom: '15px'}}>
                    <Scrollable>
                        {previewItems}
                    </Scrollable>
                </Flexbox>
                <NewMessagePanel />
            </Flexbox>
        )
    }
}

PreviewsContainer.propTypes = {
    previewItems: PropTypes.array.isRequired,
    fetchPreviews: PropTypes.func.isRequired,
    noPreviews: PropTypes.object.isRequired,
    invalidationStatus: PropTypes.string.isRequired
}

module.exports = radium(PreviewsContainer)