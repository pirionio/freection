const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')
const VisibilitySensor = require('react-visibility-sensor')
const {connect} = require('react-redux')
const classnames = require('classnames')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const HtmlUtil = require('../../util/html-util')
import EventTypes from '../../../common/enums/event-types'
const ThingCommandActions = require('../../actions/thing-command-actions')

const Flexbox = require('../UI/Flexbox')
const Color = require('color')
const TextTruncate = require('../UI/TextTruncate')
const styleVars = require('../style-vars')

class Comment extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Comment.prototype)
    }

    onVisibilityChange(isVisible) {
        const {comment} = this.props

        if (!comment.payload.isRead && isVisible) {
            this.markAsRead()
        }
    }

    markAsRead() {
        const {comment, currentUser} = this.props

        this.props.dispatch(ThingCommandActions.markCommentAsRead(comment, currentUser))
    }

    getCommentText() {
        const preStyle = {
            padding: 0,
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'Roboto, Arial'
        }

        const {comment} = this.props

        if (comment.eventType && comment.eventType.key === EventTypes.PING.key)
            return 'Ping!'

        if (comment.payload.html)
            return this.parseEmailHtml(comment.payload.html)

        return <pre style={preStyle}>{comment.payload.text}</pre>
    }

    parseEmailHtml(html) {
        const parsedHtml = HtmlUtil.parse(html)
        return <div dangerouslySetInnerHTML={{__html: parsedHtml}}></div>
    }

    render() {
        const {comment} = this.props
        const createdAt = dateFns.format(comment.createdAt, 'DD-MM-YYYY HH:mm')

        const styles = {
            comment: {
                minHeight: '79px',
                padding: '24px 30px',
                marginBottom: '5px',
                backgroundColor: 'white',
                border: `1px solid ${styleVars.baseBorderColor}`
            },
            unread: {
                color: styleVars.highlightColor,
                letterSpacing: '0.1em',
                marginLeft: '5px'
            },
            header: {
                width: '100%',
                marginBottom: '20px'
            },
            creator: {
                fontWeight: 'bold'
            },
            date: {
                color: styleVars.baseGrayColor
            },
            text: {
                lineHeight: '1.5'
            }
        }

        const unread = !comment.payload.initialIsRead ?
            <Flexbox name="comment-unread" style={styles.unread}>
                <span>***</span>
            </Flexbox> :
            null

        return (
            <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true}>
                <Flexbox name="comment-container" container="column" alignItems="flex-start"
                         style={styles.comment}>
                    <Flexbox name="comment-header" container="row" justifyContent="flex-end" alignItems="center" style={styles.header}>
                        <Flexbox name="comment-creator" grow={1} shrink={0} container="row" alignItems="center" style={styles.creator}>
                            <TextTruncate>{comment.creator.displayName}</TextTruncate>
                            {unread}
                        </Flexbox>
                        <Flexbox name="comment-date" shrink={0} style={styles.date}>
                            {createdAt}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="comment-message" grow={1} style={styles.text}>
                        {this.getCommentText()}
                    </Flexbox>
                </Flexbox>
            </VisibilitySensor>
        )
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth
    }
}

module.exports = connect(mapStateToProps)(radium(Comment))