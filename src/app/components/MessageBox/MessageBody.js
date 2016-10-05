import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {actions} from 'react-redux-form'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin'
import {EditorState, convertToRaw} from 'draft-js'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js/dist/Draft.css'
import {fromJS} from 'immutable'
import clone from 'lodash/clone'

import Flexbox from '../UI/Flexbox'

class MessageBody extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessageBody.prototype)

        this._mentionPlugin = createMentionPlugin({
            mentionPrefix: '@',
            positionSuggestions: this.positionSuggestions
        })

        this.state = {
            editorState: props.messageBox && props.messageBox.editorState ? props.messageBox.editorState : EditorState.createEmpty(),
            suggestions: clone(this.props.suggestions)
        }
    }

    componentWillReceiveProps(props) {
        if (props.messageBox.editorState) {
            this.setState({
                editorState: props.messageBox.editorState
            })
        } else {
            this.setState({
                editorState: EditorState.createEmpty()
            })
        }
    }

    positionSuggestions({decoratorRect, state, popover, props}) {
        const wrapperRect = popover.parentElement.parentElement.getBoundingClientRect()
        const topDiff = decoratorRect.top - wrapperRect.top
        const bottom = wrapperRect.height - topDiff

        const transform = state.isActive && props.suggestions.size > 0 ? 'scale(1)' : 'scale(0)'

        return {
            bottom: `${bottom}px`,
            transform
        }
    }

    bodyChanged(editorState) {
        const {dispatch} = this.props

        this.setState({
            editorState
        })

        dispatch(actions.change('messageBox.editorState', editorState))
        dispatch(actions.change('messageBox.message.body', this.getContent(this.state.editorState)))
        dispatch(actions.focus('messageBox.message.body'))
    }

    onSearchChange({value}) {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, this.props.suggestions)
        })
    }

    getContent(editorState) {
        const {blocks} = convertToRaw(editorState.getCurrentContent())

        let content = ''

        Object.keys(blocks).map(i => {
            const { entityRanges, text } = blocks[i]

            const textLength = text.length

            let startRange = 0
            entityRanges.map(range => {
                content += text.substr(startRange, range.offset - startRange )
                content += '@'
                content += text.substr(range.offset, range.length)
                startRange = range.offset + range.length
            })

            content += text.substr(startRange, textLength)
            content += '\r\n'
        })

        return content
    }

    focus() {
        this.editor.focus()
    }

    render() {
        const {sheet: {classes}, onFocus, tabIndex} = this.props
        const {MentionSuggestions} = this._mentionPlugin

        return (
            <Flexbox name="message-body" grow={1} container="row" className={classes.container}>
                <div className={classes.editor} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.bodyChanged}
                        plugins={[this._mentionPlugin]}
                        ref={ref => {this.editor = ref}}
                        onFocus={onFocus}
                        tabIndex={tabIndex}
                        placeholder="Write your message here" />
                    <MentionSuggestions
                        onSearchChange={this.onSearchChange}
                        suggestions={this.state.suggestions} />
                </div>
            </Flexbox>
        )
    }
}

// Overriding the classes of draft-js mention plugin is kinda ugly in version 1.
// There's no API to override the mention component itself, and passing in classes of our own must be done
// with plain old CSS. In addition, the CSS we pass overrides the default one, and is not merged into it,
// so we really have to provide the CSS for all the classes of the plugin.
// Therefore, I'd rather just set a rule for the specific class of the mention component.
// I have to use its generated name unfortunately, which is the ugly part :/
const style = {
    container: {
        position: 'relative',
        padding: 10,
        '& .draftJsMentionPlugin__mention__29BEd': {
            fontWeight: 'bold',
            backgroundColor: 'transparent'
        }
    },
    editor: {
        width: '100%'
    }
}

MessageBody.propTypes = {
    messageBox: PropTypes.object.isRequired,
    suggestions: PropTypes.object.isRequired,
    onFocus: PropTypes.func,
    tabIndex: PropTypes.string

}

function mapStateToProps(state) {
    return {
        messageBox: state.messageBox,
        suggestions: fromJS(state.contacts.map(contactToSuggestion))
    }
}

function contactToSuggestion(contact) {
    return {
        name: contact.payload.username
    }
}

export default useSheet(connect(mapStateToProps)(MessageBody), style)
