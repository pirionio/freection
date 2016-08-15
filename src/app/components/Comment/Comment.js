const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')
const VisibilitySensor = require('react-visibility-sensor')
const {connect} = require('react-redux')
const classnames = require('classnames')
const radium = require('radium')
const classAutobind = require('class-autobind').default

const HtmlUtil = require('../../util/html-util')
const EventTypes = require('../../../common/enums/event-types')
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
        const {comment} = this.props

        if (comment.eventType && comment.eventType.key === EventTypes.PING.key)
            return 'Ping!'

        if (comment.payload.html)
            return this.parseEmailHtml(comment.payload.html)

        return comment.payload.text
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
                minHeight: '35px',
                padding: '10px',
                marginBottom: '5px',
                backgroundColor: 'white',
                border: `1px solid, ${styleVars.primaryColor}`
            },
            unread: {
                backgroundColor: Color('rgba(232, 221, 110, 0.36)').hexString()
            },
            creator: {
                width: '120px'
            },
            text: {
                padding: '0 10px'
            },
            date: {
                width: '120px'
            }
        }

        return (
            <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true}>
                <Flexbox name="comment-container" container="row" alignItems="flex-start"
                         style={[styles.comment, !comment.payload.initialIsRead && styles.unread]}>
                    <Flexbox name="comment-creator" shrink={0} style={styles.creator}>
                        <TextTruncate>{comment.creator.displayName} :</TextTruncate>
                    </Flexbox>
                    <Flexbox name="comment-message" grow={1} style={styles.text}>
                        {this.getCommentText()}
                    </Flexbox>
                    <Flexbox name="comment-date" shrink={0} style={styles.date}>
                        {createdAt}
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