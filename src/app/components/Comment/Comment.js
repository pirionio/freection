const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')
const VisibilitySensor = require('react-visibility-sensor')
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const useSheet = require('react-jss').default

const HtmlUtil = require('../../util/html-util')
import EventTypes from '../../../common/enums/event-types'
import * as ThingCommandActions from '../../actions/thing-command-actions'

const Flexbox = require('../UI/Flexbox')
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
        const {comment, sheet: {classes}} = this.props

        if (comment.eventType && comment.eventType.key === EventTypes.PING.key)
            return 'Ping!'

        if (comment.payload.html)
            return this.parseEmailHtml(comment.payload.html)

        return <pre className={classes.pre}>{comment.payload.text}</pre>
    }

    parseEmailHtml(html) {
        const parsedHtml = HtmlUtil.parse(html)
        return <div dangerouslySetInnerHTML={{__html: parsedHtml}}></div>
    }

    render() {
        const {comment, sheet: {classes}} = this.props
        const createdAt = dateFns.format(comment.createdAt, 'DD-MM-YYYY HH:mm')

        const unread = !comment.payload.initialIsRead ?
            <Flexbox name="comment-unread" className={classes.unread}>
                <span>***</span>
            </Flexbox> :
            null

        return (
            <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true}>
                <Flexbox name="comment-container" container="column" alignItems="flex-start" className={classes.comment}>
                    <Flexbox name="comment-header" container="row" justifyContent="flex-end" alignItems="center" className={classes.header}>
                        <Flexbox name="comment-creator" grow={1} shrink={0} container="row" alignItems="center" className={classes.creator}>
                            <TextTruncate>{comment.creator.displayName}</TextTruncate>
                            {unread}
                        </Flexbox>
                        <Flexbox name="comment-date" shrink={0} className={classes.date}>
                            {createdAt}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox name="comment-message" grow={1} className={classes.text}>
                        {this.getCommentText()}
                    </Flexbox>
                </Flexbox>
            </VisibilitySensor>
        )
    }
}

const style = {
    comment: {
        minHeight: 79,
        padding: [24, 30],
        marginBottom: 5,
        backgroundColor: 'white',
        border: `1px solid ${styleVars.baseBorderColor}`
    },
    unread: {
        color: styleVars.highlightColor,
        letterSpacing: '0.1em',
        marginLeft: 5
    },
    header: {
        width: '100%',
        marginBottom: 20
    },
    creator: {
        fontWeight: 'bold'
    },
    date: {
        color: styleVars.baseGrayColor
    },
    text: {
        lineHeight: '1.5'
    },
    pre: {
        padding: 0,
        margin: 0,
        whiteSpace: 'pre-wrap',
        fontFamily: 'Roboto, Arial'
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth
    }
}

module.exports = useSheet(connect(mapStateToProps)(Comment), style)