const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')
const VisibilitySensor = require('react-visibility-sensor')
const {connect} = require('react-redux')
const classnames = require('classnames')
const sanitizeHtml = require('sanitize-html')
const cheerio = require('cheerio')
const juice = require('juice/client')

const EventTypes = require('../../../common/enums/event-types')
const ThingCommandActions = require('../../actions/thing-command-actions')

class Comment extends Component {
    constructor(props) {
        super(props)
        this.onVisibilityChange = this.onVisibilityChange.bind(this)
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
        const {comment} = this.props

        if (comment.eventType && comment.eventType.key === EventTypes.PING.key)
            return 'Ping!'

        if (comment.payload.html)
            return this.parseEmailHtml(comment.payload.html)

        return comment.payload.text
    }

    parseEmailHtml(html) {

        const $ = cheerio.load(juice(html))
        $('.gmail_quote').remove()
        return <div dangerouslySetInnerHTML={{__html: sanitizeHtml($.html(), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'span', 'center', 'colgroup', 'col' ]),
            allowedAttributes: {
                '*': ['style', 'align', 'valign', 'width', 'height', 'title', 'dir'],
                a: [ 'href', 'name', 'target' ],
                img: [ 'src', 'alt' ],
                table: ['border', 'cellpadding', 'cellspacing', 'bgcolor']
            }
        })}}></div>
    }

    render() {
        const {comment} = this.props
        const createdAt = dateFns.format(comment.createdAt, 'DD-MM-YYYY HH:mm')
        const containerClassname = classnames('comment-container', {
            'comment-unread': !comment.payload.initialIsRead
        })

        return (
        <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true}>
            <div className={containerClassname}>
                <div className="comment-creator">
                    {comment.creator.email} :
                </div>
                <div className="comment-message">
                    {this.getCommentText()}
                </div>
                <div className="comment-date">
                    {createdAt}
                </div>
            </div>
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

module.exports = connect(mapStateToProps)(Comment)