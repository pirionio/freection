const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const {getChildOfType, createSlots} = require('../../util/component-util')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default
const classNames = require('classnames')

import * as InlineMessageActions from '../../actions/inline-message-actions'

const InlineMessage = require('./InlineMessage')
const Flexbox = require('../UI/Flexbox')
const Ellipse = require('../UI/Ellipse')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

const PreviewItemText = require('./PreviewItemText')
const slots = createSlots('PreviewItemActions', 'PreviewItemUser')

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
        this.state = {showInlineMessage: false}
        classAutobind(this, PreviewItem.prototype)
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.inlineMessage.show)
            this.setState({showInlineMessage: false})
    }

    getPreviewText() {
        return getChildOfType(this.props.children, PreviewItemText)
    }

    getActions() {
        const original = getChildOfType(this.props.children, slots.PreviewItemActions)
        return React.cloneElement(original, {preDoFunc: this.openInlineMessage})
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

    getUser() {
        return getChildOfType(this.props.children, slots.PreviewItemUser)
    }

    render() {
        const {circleColor, title, onClick, sheet: {classes}} = this.props

        const statusPreview = this.getStatus()
        const userPreview = this.getUser()
        const textPreview = this.getPreviewText()
        const inlineMessage = this.getInlineMessage()

        const containerClass = classNames(classes.container, {
            'withInlineReply': this.state.showInlineMessage
        })
        const leftBoxClass = classNames(classes.leftBox, {
            'withStatus': !!statusPreview
        })

        return (
            <div name="preview-item-container" className={containerClass}>
                <Flexbox name="preview-item" shrink={0} container='row' className={classes.preview} onClick={onClick}>
                    { circleColor ?
                        <Flexbox name="preview-circle" shrink={0} container='column' justifyContent="center" className={classes.circleContainer}>
                            <Ellipse color={circleColor} className={classes.circle} />
                        </Flexbox> :
                        null
                    }
                    <Flexbox name="left-box" shrink={0} container='column' justifyContent="space-around" className={leftBoxClass}>
                        {
                            statusPreview ?
                                <Flexbox name="status">{statusPreview}</Flexbox> :
                                <Flexbox name="user">{userPreview}</Flexbox>
                        }
                    </Flexbox>
                    <Flexbox name="center-box" container="row" justifyContent="flex-start" alignItems="center" grow={1} className={classes.centerBox}>
                        <Flexbox name="subject" className={classes.subject}>
                            <TextTruncate><strong>{title}</strong></TextTruncate>
                        </Flexbox>
                        {textPreview ? <Flexbox name="text" grow={1} className={classes.text}>{textPreview}</Flexbox> : null}
                    </Flexbox>
                    <Flexbox name="right-box" container="column" justifyContent="center" shrink={0} className={classes.rightBox}>
                        {this.getActions()}
                    </Flexbox>
                </Flexbox>
                {inlineMessage}
            </div>
        )
    }
}

const style = {
    container: {
        width: '100%',
        marginBottom: 5,
        backgroundColor: styleVars.secondaryBackgroundColor,
        border: {
            weight: 1,
            style: 'sold',
            color: styleVars.baseBorderColor
        },
        '&.withInlineReply': {
            position: 'absolute',
            zIndex: styleVars.previewInlineReplyZIndex
        },
        '&:hover': {
            width: '100%',
            cursor: 'pointer',
            '& $rightBox': {
                width: 'inherit',
                minWidth: 120,
                maxWidth: 287
            },
            '& $circle': {
                width: 12,
                height: 12,
                marginLeft: -2
            },
            '& .restOfActions': {
                display: 'block'
            }
        }
    },
    preview: {
        height: 50,
        paddingLeft: 30,
        paddingRight: 30
    },
    leftBox: {
        width: 160,
        padding: [4, 0],
        '&.withStatus': {
            width: 250
        }
    },
    centerBox: {
        padding: [4, 0],
        minWidth: 0
    },
    rightBox: {
        width: 120
    },
    circleContainer: {
        width: 19
    },
    circle: {
        width: 8,
        height: 8,
        marginRight: 11
    },
    subject: {
        marginRight: 0
    },
    text: {
        minWidth: 0
    },
    date:{
        color: styleVars.baseGrayColor
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
    PreviewItem: useSheet(connect(mapStateToProps)(PreviewItem), style),
    PreviewItemText,
    PreviewItemStatus
}, slots)
