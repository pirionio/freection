const React = require('react')
const {PropTypes, Component} = React

const {PreviewItem, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const GithubActionsBar = require('./GithubActionsBar')
const TextTruncate = require('../UI/TextTruncate')
import ThingStatus from '../../../common/enums/thing-status'
const styleVars = require('../style-vars')

class GithubTodoPreviewItem extends Component {
    getTextElement() {
        const {thing} = this.props

        if (thing.body) {
            return (
                <Flexbox container="row">
                    <Flexbox shrink={0}><TextSeparator /></Flexbox>
                    <Flexbox grow={1} style={{minWidth: 0}}><TextTruncate>{thing.body}</TextTruncate></Flexbox>
                </Flexbox>)
        }

        return null
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
                    <GithubActionsBar thing={thing}/>
                </PreviewItemActions>
            </PreviewItem>
        )
    }
}

GithubTodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired
}

module.exports = GithubTodoPreviewItem
