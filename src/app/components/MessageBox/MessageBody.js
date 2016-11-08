import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {actions} from 'react-redux-form'
import classAutobind from 'class-autobind'
import classNames from 'classnames'
import useSheet from 'react-jss'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin'
import {EditorState, ContentState, convertToRaw, getDefaultKeyBinding} from 'draft-js'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js/dist/Draft.css'
import {fromJS} from 'immutable'
import clone from 'lodash/clone'
import trimEnd from 'lodash/trimEnd'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import {GeneralConstants} from '../../constants'
import {isCommandEnter} from '../../helpers/key-binding-helper.js'

class MessageBody extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, MessageBody.prototype)

        const {sheet: {classes}} = props

        this._mentionPlugin = createMentionPlugin({
            mentionPrefix: '@',
            positionSuggestions: this.positionSuggestions,
            theme: {
                mention: classes.mention,
                mentionSuggestions: classes.mentionSuggestions,
                mentionSuggestionsEntry: classes.mentionSuggestionsEntry,
                mentionSuggestionsEntryText: classes.mentionSuggestionsEntryText,
                mentionSuggestionsEntryFocused: classes.mentionSuggestionsEntryFocused,
                mentionSuggestionsEntryAvatar: classes.mentionSuggestionsEntryAvatar
            }
        })

        this.state = {
            editorState: props.messageBox && props.messageBox.editorState ? props.messageBox.editorState : EditorState.createEmpty(),
            suggestions: clone(this.props.suggestions)
        }
    }

    componentWillReceiveProps(props) {
        // Change the whole state only if the message box itself had been changed.
        if (this.props.messageBox.id !== props.messageBox.id) {

            // This the correct way to change the editor's state according to draft-js: change only its content, not the whole editor.
            const newContentState = props.messageBox.editorState ?
                props.messageBox.editorState.getCurrentContent() :
                ContentState.createFromText('')

            this.setState({
                editorState: EditorState.push(this.state.editorState, newContentState)
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
        dispatch(actions.change('messageBox.message.body', this.getContent(editorState)))
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
            const {entityRanges, text} = blocks[i]

            const textLength = text.length

            let startRange = 0
            entityRanges.map(range => {
                content += text.substr(startRange, range.offset - startRange)
                content += '@'
                content += text.substr(range.offset, range.length)
                startRange = range.offset + range.length
            })

            content += text.substr(startRange, textLength)
            content += '\r\n'
        })

        return trimEnd(content, '\r\n')
    }

    focus() {
        this.editor.focus()
    }

    setEditorRef(ref) {
        const {editorRef} = this.props

        this.editor = ref

        if (editorRef)
            editorRef(ref)
    }

    keyBinding(event) {
        if (isCommandEnter(event)) {
            return 'commandEnter'
        }

        return getDefaultKeyBinding(event)
    }

    handleKeyCommand(command) {
        const {onCommandEnter} = this.props

        if (command === 'commandEnter' && onCommandEnter) {
            setTimeout(() => onCommandEnter())
            return 'handled'
        }

        return 'not-handled'
    }

    render() {
        const {sheet: {classes}, onFocus, tabIndex, className} = this.props
        const {MentionSuggestions} = this._mentionPlugin

        const containerClasses = classNames(classes.containerBase, className ? className : classes.containerDefault,
            GeneralConstants.INSPECTLET_SENSITIVE_CLASS)

        return (
            <Flexbox name="message-body" container="row" className={containerClasses}>
                <div className={classes.editor} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.bodyChanged}
                        plugins={[this._mentionPlugin]}
                        ref={this.setEditorRef}
                        onFocus={onFocus}
                        tabIndex={tabIndex}
                        keyBindingFn={this.keyBinding}
                        handleKeyCommand={this.handleKeyCommand}
                        placeholder="Write your message here" />
                    <MentionSuggestions
                        onSearchChange={this.onSearchChange}
                        suggestions={this.state.suggestions} />
                </div>
            </Flexbox>
        )
    }
}

// Overriding the classes of draft-js is kinda ugly.
// For the draft-js editor, I have to override the classes I want to change.
// For the mention plugin, I can give an object of classes, but the object I provide is not merged with the default styles, but rather overrides it.
// Therefore, I have to set the styles for all of the components of the mention plugin, if I want to override only one of them.
const style = {
    containerBase: {
        lineHeight: 2,
        letterSpacing: styleVars.messageLetterSpacing,
        position: 'relative',
        '& .public-DraftEditor-content': {
            overflowY: 'auto',
            maxHeight: '100%'
        }
    },
    containerDefault: {
        height: 87
    },
    editor: {
        width: '100%'
    },
    mention: {
        fontWeight: 'bold',
        color: styleVars.mentionColor,
        backgroundColor: 'transparent',
        display: 'inline-block',
        padding: [0, 2],
        borderRadius: 2,
        textDecoration: 'none'
    },
    mentionSuggestions: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        minWidth: 220,
        maxWidth: 440,
        backgroundColor: 'white',
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
        padding: [8, 0],
        zIndex: styleVars.mentionSuggestionsZIndex,
        transform: 'scale(0)',
        boxSizing: 'border-box'
    },
    mentionSuggestionsEntry: {
        height: 32,
        lineHeight: '32px',
        padding: [0, 20],
        cursor: 'pointer',
        transition: 'background-color 0.4s cubic-bezier(.27,1.27,.48,.56)',
        '&:active': {
            backgroundColor: styleVars.suggestionColor
        }
    },
    mentionSuggestionsEntryFocused: {
        height: 32,
        lineHeight: '32px',
        padding: [0, 20],
        cursor: 'pointer',
        backgroundColor: styleVars.suggestionColor
    },
    mentionSuggestionsEntryText: {
        maxWidth: 368,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '0.857em',
        letterSpacing: '0.025em'
    },
    mentionSuggestionsEntryAvatar: {
        height: 24,
        width: 24,
        display: 'inline-block',
        borderRadius: 12
    }
}

MessageBody.propTypes = {
    messageBox: PropTypes.object.isRequired,
    suggestions: PropTypes.object.isRequired,
    onFocus: PropTypes.func,
    onCommandEnter: PropTypes.func,
    tabIndex: PropTypes.string,
    className: PropTypes.string,
    editorRef: PropTypes.func
}

function mapStateToProps(state) {
    return {
        messageBox: state.messageBox,
        suggestions: fromJS(state.users.map(contactToSuggestion))
    }
}

function contactToSuggestion(contact) {
    return {
        name: contact.payload.username
    }
}

export default useSheet(connect(mapStateToProps)(MessageBody), style)
