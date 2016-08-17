const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {getChildOfType, createSlots} = require('../../util/component-util')
const dateFns = require('date-fns')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const InlineMessageActions = require('../../actions/inline-message-actions')

const InlineMessage = require('./InlineMessage')
const Flexbox = require('../UI/Flexbox')
const Ellipse = require('../UI/Ellipse')
const styleVars = require('../style-vars')

const slots = createSlots('PreviewItemText', 'PreviewItemActions')

const PreviewItemStatus = ({status, children}) => {
    if (status)
        return <span>{status}</span>

    return React.Children.only(children)
}

PreviewItemStatus.propTypes = {
    status: PropTypes.string
}

class PreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, PreviewItem.prototype)
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.inlineMessage.show)
            this.setState({showInlineMessage: false})
    }

    getPreviewText() {
        return getChildOfType(this.props.children, slots.PreviewItemText)
    }

    getActions() {
        const original = getChildOfType(this.props.children, slots.PreviewItemActions)
        const isRollover = radium.getState(this.state, 'preview', ':hover')
        return React.cloneElement(original, {isRollover: isRollover, preDoFunc: this.openInlineMessage})
    }

    openInlineMessage(action) {
        const {dispatch} = this.props
        this.setState({showInlineMessage: true})
        dispatch(InlineMessageActions.show(action))
    }

    getInlineMessage() {
        return this.state.showInlineMessage ?
            <InlineMessage expandedMessages={this.props.expandedMessages} /> :
            null
    }

    getStatus() {
        return getChildOfType(this.props.children, PreviewItemStatus)
    }

    getDateText() {
        const {date} = this.props

        const time = dateFns.format(date, 'HH:mm')

        if (dateFns.isToday(date)) {
            return <span>Today at {time}</span>
        } else if (dateFns.isYesterday(date)) {
            return <span>Yesterday at {time}</span>
        } else {
            return <span>{dateFns.format(date, 'DD MMM YYYY')} at {time}</span>
        }
    }

    getStyles() {
        return {
            container: {
                width: '100%',
                marginBottom: '5px',
                backgroundColor: '#FAFAFA',
                border: '1px solid #e0e0e0',
                withInlineReply: {
                    position: 'absolute',
                    zIndex: styleVars.previewInlineReplyZIndex
                }
            },
            hoverable: {
                width: '100%',
                ':hover': {},
                cursor: 'pointer'
            },
            preview: {
                paddingLeft: '30px',
                paddingRight: '30px'
            },
            text: {
                lineHeight: styleVars.previewLineHeight
            },
            status: {
                lineHeight: styleVars.previewLineHeight
            },
            date:{
                color: styleVars.baseGrayColor,
                lineHeight: styleVars.previewLineHeight
            }
        }
    }

    render() {
        const {circleColor, title, onClick} = this.props

        const statusPreview = this.getStatus()
        const textPreview = this.getPreviewText()
        const inlineMessage = this.getInlineMessage()

        const styles = this.getStyles()

        return (
            <div name="preview-item-container" style={[styles.container, this.state.showInlineMessage && styles.container.withInlineReply]}>
                <div name="preview-item-hoverable" key="preview" style={styles.hoverable} onClick={onClick}>
                    <Flexbox name="preview-item" shrink={0} height='70px' container='row' style={styles.preview}>
                        { circleColor ?
                            <Flexbox name="preview-circle" width='19px' shrink={0} container='column' justifyContent="center">
                                <Ellipse width="8xp" height="8px" color={circleColor} />
                            </Flexbox> :
                            null
                        }
                        <Flexbox name="left-box" width='300px' shrink={0} container='column' justifyContent="center">
                            <Flexbox name="status" style={styles.status}>{statusPreview}</Flexbox>
                            <Flexbox name="date" style={styles.date}>
                                {this.getDateText()}
                            </Flexbox>
                        </Flexbox>
                        <Flexbox name="center-box" container="column" justifyContent="center" grow={1} style={{minWidth: 0}}>
                            <Flexbox name="title">
                                <strong>{title}</strong>
                            </Flexbox>
                            {textPreview ? <Flexbox name="text" style={styles.text}>{textPreview}</Flexbox> : null}
                        </Flexbox>
                        <Flexbox name="right-box" container="column" justifyContent="center" shrink={0} width='250px'>
                            {this.getActions()}
                        </Flexbox>
                    </Flexbox>
                </div>
                {inlineMessage}
            </div>
        )
    }
}

PreviewItem.propTypes = {
    circleColor: PropTypes.string,
    title: PropTypes.string.isRequired,
    date: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
    inlineMessage: PropTypes.object.isRequired,
    expandedMessages: PropTypes.array
}

function mapStateToProps(state) {
    return {
        inlineMessage: state.inlineMessage
    }
}

module.exports = Object.assign({
    PreviewItem: connect(mapStateToProps)(radium(PreviewItem)),
    PreviewItemStatus
}, slots)
