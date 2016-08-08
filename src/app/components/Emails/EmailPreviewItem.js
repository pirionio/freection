const React = require('react')
const {PropTypes} = React
const {connect} = require('react-redux')

const TextTruncate = require('../UI/TextTruncate')
const EmailPreviewActionBar = require('./EmailPreviewActionsBar')
const EmailPageActions = require('../../actions/email-page-actions')
const {PreviewItem, PreviewItemUser, PreviewItemTitle, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')

const EmailPreviewItem = ({email, dispatch}) => {
    return (
        <PreviewItem>
            <PreviewItemUser>
                <span>{email.creator.displayName}</span>
            </PreviewItemUser>
            <PreviewItemTitle>
                <a onClick={() => dispatch(EmailPageActions.show(email.entityId))}>{email.subject}</a>
            </PreviewItemTitle>
            <PreviewItemDate date={email.createdAt}/>
            <PreviewItemText>
                <TextTruncate>{email.payload.text}</TextTruncate>
            </PreviewItemText>
            <PreviewItemActions>
                <EmailPreviewActionBar emailUids={email.payload.emailUids} email={email} />
            </PreviewItemActions>
        </PreviewItem>
    )
}

EmailPreviewItem.propTypes = {
    email: PropTypes.object.isRequired
}

module.exports = connect()(EmailPreviewItem)
