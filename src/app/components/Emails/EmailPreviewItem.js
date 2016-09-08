import React from 'react'
const {PropTypes, Component} = React
import {connect} from 'react-redux'
import useSheet from 'react-jss'

import TextTruncate from '../UI/TextTruncate'
import EmailPreviewActionBar from './EmailPreviewActionsBar'
import * as EmailPageActions from '../../actions/email-page-actions'
import PreviewItem, { PreviewItemUser, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import TextSeparator from '../UI/TextSeparator'
import Flexbox from '../UI/Flexbox'

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

export default useSheet(connect()(EmailPreviewItem), style)
