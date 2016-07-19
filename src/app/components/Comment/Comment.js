const React = require('react')
const {Component, PropTypes} = React
const dateFns = require('date-fns')

class Comment extends Component {
    render() {
        const {comment} = this.props
        const createdAt = dateFns.format(comment.createdAt, 'DD-MM-YYYY HH:mm')
        return (
            <div className="comment-container">
                <div className="comment-creator">
                    {comment.creator.email} :
                </div>
                <div className="comment-message">
                    {comment.payload.text}
                </div>
                <div className="comment-date">
                    {createdAt}
                </div>
            </div>
        )
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired
}

module.exports = Comment