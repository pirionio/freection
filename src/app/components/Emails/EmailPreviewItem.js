const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')

const TextTruncate = require('../UI/TextTruncate')
const EmailPreviewActionBar = require('./EmailPreviewActionsBar')
const EmailPageActions = require('../../actions/email-page-actions')
const {PreviewItem, PreviewItemStatus, PreviewItemText, PreviewItemActions} = require('../Preview/PreviewItem')

class EmailPreviewItem extends Component {
    render() {
        const {email, dispatch} = this.props

        return (
            <PreviewItem title={email.subject}
                         date={email.createdAt}
                         onClick={() => dispatch(EmailPageActions.showEmailPage(email))}>
                <PreviewItemStatus>
                    <strong>{email.creator.displayName}</strong>
                </PreviewItemStatus>
                <PreviewItemText>
                    <TextTruncate>{email.payload.text}</TextTruncate>
                </PreviewItemText>
                <PreviewItemActions>
                    <EmailPreviewActionBar emailUids={email.payload.emailUids} email={email}/>
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

EmailPreviewItem.propTypes = {
    email: PropTypes.object.isRequired
}

module.exports = connect()(EmailPreviewItem)
