const React = require('react')
const {PropTypes, Component} = React

const {PreviewItem, PreviewItemTitle, PreviewItemStatus, PreviewItemDate, PreviewItemText, PreviewItemActions} =
    require('../Preview/PreviewItem')
const GithubActionsBar = require('./GithubActionsBar')
const TextTruncate = require('../UI/TextTruncate')
const ThingStatus = require('../../../common/enums/thing-status')
const styleVars = require('../style-vars')

class GithubTodoPreviewItem extends Component {
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
                    <TextTruncate>{thing.body}</TextTruncate>
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
