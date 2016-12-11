import React, {PropTypes, Component} from 'react'
import useSheet from 'react-jss'

import PreviewItem, {PreviewItemStatus, PreviewItemText, PreviewItemActions} from '../../Preview/PreviewItem'
import TextTruncate from '../../UI/TextTruncate'
import ThingStatus from '../../../../common/enums/thing-status'
import styleVars from '../../style-vars'
import Flexbox from '../../UI/Flexbox'
import TextSeparator from '../../UI/TextSeparator'
import ActionsBar from '../../Actions/ActionsBar'

const ExternalActionsBar = () => {
    return <ActionsBar actions={[]} />
}

ExternalActionsBar.propTypes = {
    thing: PropTypes.object.isRequired,
    isRollover: PropTypes.bool
}

class ExternalPreviewItem extends Component {
    getTextElement() {
        const {thing, sheet: {classes}} = this.props

        if (thing.body) {
            return (
                <Flexbox container="row">
                    <Flexbox shrink={0}><TextSeparator /></Flexbox>
                    <Flexbox grow={1} className={classes.textRow}>
                        <TextTruncate>
                            {thing.body}
                        </TextTruncate>
                    </Flexbox>
                </Flexbox>)
        }

        return null
    }

    getCircleColor() {
        const {thing} = this.props

        switch (thing.payload.status) {
            case ThingStatus.DISMISS.key:
                return styleVars.redCircleColor
            case ThingStatus.NEW.key:
            case ThingStatus.INPROGRESS.key:
            case ThingStatus.REOPENED.key:
                return styleVars.blueCircleColor
            case ThingStatus.CLOSE.key:
            case ThingStatus.DONE.key:
                return styleVars.greenCircleColor
        }
    }

    render() {
        const {thing} = this.props

        return (
            <PreviewItem circleColor={this.getCircleColor()}
                         title={thing.subject}
                         date={thing.createdAt}
                         onClick={() => window.open(thing.payload.url, '_blank')}>
                <PreviewItemStatus>
                    <strong>{thing.creator.displayName}</strong>
                </PreviewItemStatus>
                <PreviewItemText>
                    {this.getTextElement()}
                </PreviewItemText>
                <PreviewItemActions>
                    <ExternalActionsBar thing={thing}/>
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

ExternalPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

export default useSheet(ExternalPreviewItem, style)
