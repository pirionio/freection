import React, {PropTypes, Component} from 'react'
import useSheet from 'react-jss'
import classAutobind from 'class-autobind'

import PreviewItem, { PreviewItemUser, PreviewItemText, PreviewItemActions} from '../Preview/PreviewItem'
import GithubActionsBar from './GithubActionsBar'
import TextTruncate from '../UI/TextTruncate'
import ThingStatus from '../../../common/enums/thing-status'
import styleVars from '../style-vars'
import Flexbox from '../UI/Flexbox'
import TextSeparator from '../UI/TextSeparator'

class EmailThingPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, EmailThingPreviewItem.prototype)
    }

    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
            case ThingStatus.CLOSE.key:
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.NEW.key:
            case ThingStatus.INPROGRESS.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
        }
    }

    getEmailUrl() {
        const {thing} = this.props
        return `https://mail.google.com/mail/u/${thing.creator.payload.email}/#inbox/${thing.payload.threadIdHex}`
    }

    render() {
        const {thing} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         onClick={() => window.open(this.getEmailUrl(), '_blank')}>
                <PreviewItemUser>
                    <strong>{thing.creator.displayName}</strong>
                </PreviewItemUser>
                <PreviewItemActions>
                    <GithubActionsBar thing={thing}/>
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

EmailThingPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

export default useSheet(EmailThingPreviewItem, style)
