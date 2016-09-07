const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')
const useSheet = require('react-jss').default

const TextTruncate = require('../UI/TextTruncate')
const EmailPreviewActionBar = require('./EmailPreviewActionsBar')
import * as EmailPageActions from '../../actions/email-page-actions'
const {PreviewItem, PreviewItemUser, PreviewItemText, PreviewItemActions} = require('../Preview/PreviewItem')
const TextSeparator = require('../UI/TextSeparator')
const Flexbox = require('../UI/Flexbox')

class EmailPreviewItem extends Component {
    getTextElement() {
        const {email, sheet: {classes}} = this.props

        if (email.payload.text) {
            return (
                <Flexbox container="row">
                    <Flexbox shrink={0}><TextSeparator /></Flexbox>
                    <Flexbox grow={1} className={classes.textRow}>
                        <TextTruncate>{email.payload.text}</TextTruncate>
                    </Flexbox>
                </Flexbox>)
        }

        return null
    }

    render() {
        const {email, dispatch} = this.props

        return (
            <PreviewItem title={email.subject}
                         date={email.createdAt}
                         onClick={() => dispatch(EmailPageActions.showEmailPage(email))}>
                <PreviewItemUser>
                    <strong>{email.creator.displayName}</strong>
                </PreviewItemUser>
                <PreviewItemText>
                    {this.getTextElement()}
                </PreviewItemText>
                <PreviewItemActions>
                    <EmailPreviewActionBar emailUids={email.payload.emailUids} email={email}/>
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

const style = {
    textRow: {
        minWidth: 0
    }
}

EmailPreviewItem.propTypes = {
    email: PropTypes.object.isRequired
}

module.exports = useSheet(connect()(EmailPreviewItem), style)
