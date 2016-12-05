import React, {PropTypes, Component} from 'react'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import PreviewCard from '../Preview/PreviewCard'
import {PreviewCardRecipients, PreviewCardActions} from '../Preview/PreviewCard'
import CommandsBar from '../Commands/CommandsBar.js'

class GithubTodoPreviewItem extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, GithubTodoPreviewItem.prototype)
    }

    getRecipients() {
        const {thing} = this.props
        return thing.creator.displayName
    }

    render() {
        const {thing, commands, index, reorder, commitReorder} = this.props

        return (
            <PreviewCard thing={thing}
                         entityId={thing.id}
                         index={index}
                         category={thing.todoTimeCategory}
                         reorder={reorder}
                         commitReorder={commitReorder}
                         onClick={() => window.open(thing.payload.url, '_blank')}>
                <PreviewCardRecipients>
                    <span>{this.getRecipients()}</span>
                </PreviewCardRecipients>
                <PreviewCardActions>
                    <CommandsBar thing={thing} commands={commands} supportRollover={false} />
                </PreviewCardActions>
            </PreviewCard>
        )
    }
}

const style = {
    textRow: {
        minWidth: 0
    }
}

GithubTodoPreviewItem.propTypes = {
    thing: PropTypes.object.isRequired,
    commands: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    reorder: PropTypes.func.isRequired,
    commitReorder: PropTypes.func.isRequired
}

export default useSheet(GithubTodoPreviewItem, style)
