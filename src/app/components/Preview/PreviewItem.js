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
        classAutobind(this, PreviewItem.prototype)
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.inlineMessage.show)
            this.setState({showInlineMessage: false})
    }

    isRollover() {
        return radium.getState(this.state, 'preview', ':hover')
    }

    getPreviewText() {
        return getChildOfType(this.props.children, PreviewItemText)
    }

    getActions() {
        const original = getChildOfType(this.props.children, slots.PreviewItemActions)
        return React.cloneElement(original, {isRollover: this.isRollover(), preDoFunc: this.openInlineMessage})
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
                backgroundColor: styleVars.secondaryBackgroundColor,
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
                height: '50px',
                paddingLeft: '30px',
                paddingRight: '30px'
            },
            leftBox: {
                width: '160px',
                padding: '4px 0',
                withStatus: {
                    width: '250px'
                }
            },
            centerBox: {
                padding: '4px 0',
                minWidth: 0
            },
            rightBox: {
                width: '120px',
                rollover: {
                    width: 'inherit',
                    minWidth: '120px',
                    maxWidth: '287px'
                }
            },
            circle: {
                width: '8px',
                height: '8px',
                rollover: {
                    width: '12px',
                    height: '12px',
                    marginLeft: '-2px'
                },
                container: {
                    width: '19px'
                }
            },
            subject: {
                marginRight: '0'
            },
            text: {
                minWidth: 0
            },
            date:{
                color: styleVars.baseGrayColor
            },
            separator: {
                width: '13px',
                textAlign: 'center'
            }
        }
    }

    render() {
        const {circleColor, title, onClick} = this.props

        const statusPreview = this.getStatus()
        const userPreview = this.getUser()
        const textPreview = this.getPreviewText()
        const inlineMessage = this.getInlineMessage()

        const styles = this.getStyles()
        const isRollover = this.isRollover()

        return (
            <div name="preview-item-container" style={[styles.container, this.state.showInlineMessage && styles.container.withInlineReply]}>
                <div name="preview-item-hoverable" key="preview" style={styles.hoverable} onClick={onClick}>
                    <Flexbox name="preview-item" shrink={0} container='row' style={styles.preview}>
                        { circleColor ?
                            <Flexbox name="preview-circle" shrink={0} container='column' justifyContent="center" style={styles.circle.container}>
                                <Ellipse color={circleColor} style={!isRollover ? styles.circle : styles.circle.rollover} />
                            </Flexbox> :
                            null
                        }
                        <Flexbox name="left-box" shrink={0} container='column' justifyContent="space-around"
                                 style={[styles.leftBox, !!statusPreview && styles.leftBox.withStatus]}>
                            {
                                statusPreview ?
                                    <Flexbox name="status">{statusPreview}</Flexbox> :
                                    <Flexbox name="user">{userPreview}</Flexbox>
                            }
                        </Flexbox>
                        <Flexbox name="center-box" container="row" justifyContent="flex-start" alignItems="center" grow={1} style={styles.centerBox}>
                            <Flexbox name="subject" style={styles.subject}>
                                <TextTruncate><strong>{title}</strong></TextTruncate>
                            </Flexbox>
                            <Flexbox grow={0} shrink={0} style={styles.separator}>•</Flexbox>
                            {textPreview ? <Flexbox name="text" grow={1} style={styles.text}>{textPreview}</Flexbox> : null}
                        </Flexbox>
                        <Flexbox name="right-box" container="column" justifyContent="center" shrink={0}
                                 style={[styles.rightBox, isRollover && styles.rightBox.rollover]}>
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
    PreviewItemText,
    PreviewItemStatus
}, slots)
