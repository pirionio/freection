import React, {PropTypes, Component}  from 'react'
import {connect} from 'react-redux'
import {actions} from 'react-redux-form'
import Autosuggest from 'react-autosuggest'
import useSheet from 'react-jss'
import omit from 'lodash/omit'
import some from 'lodash/some'
import takeRight from 'lodash/takeRight'
import orderBy from 'lodash/orderBy'
import get from 'lodash/get'

class To extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    getSuggestions(value) {
        if (!value)
            return []

        const valueLowCase = value.toLowerCase()
        const { contacts, currentUser} = this.props
        const withMe = [...contacts, { displayName: 'Me', payload: { email: currentUser.email}}]

        const filtered = withMe.filter(contact => {
            const nameParts = contact.displayName.toLowerCase().split(' ')

            return some(nameParts, part => part.startsWith(valueLowCase))
        }).map(contact => { return {
            email: contact.payload.email,
            text: `${contact.displayName} <${contact.payload.email}>`
        }})

        return orderBy(takeRight(filtered, 6), ['text'], ['desc'])
    }

    renderSuggestion(suggestion) {
        return (
            <span>{suggestion.text}</span>
        )
    }

    renderSuggestionContainer(props) {
        const {style, children} = props
        const anyChildren = React.Children.count(children)
        const propsWithoutChildrenAndStyle = omit(props, ['children', 'style'])

        return <div style={anyChildren ? style : {display:'none'}} {...propsWithoutChildrenAndStyle}>
                {children}
            </div>
    }

    getSuggestionValue(suggestion){
        return suggestion.text
    }

    onChange(event, {newValue, method}) {
        const {model, dispatch} = this.props

        dispatch(actions.change(model, newValue))

        if (method === 'enter') {
            event.preventDefault()
        }
    }

    render() {
        const {value, placeholder, containerClassName, inputClassName, tabIndex , onFocus, inputRef, sheet: {classes}} = this.props

        const suggestions = this.getSuggestions(value)

        return (
            <div name="message-to" className={containerClassName}>
                <Autosuggest suggestions={suggestions}
                             getSuggestionValue={this.getSuggestionValue}
                             renderSuggestion={this.renderSuggestion}
                             renderSuggestionsContainer={this.renderSuggestionContainer}
                             focusFirstSuggestion={true}
                             theme={classes}
                             ref={ref => {
                                 if(inputRef && ref)
                                     inputRef(ref.input)
                             }}
                             inputProps={{
                                 type: 'text',
                                 className: inputClassName,
                                 tabIndex: tabIndex,
                                 placeholder: placeholder,
                                 value:  value,
                                 onChange: this.onChange,
                                 onFocus: onFocus
                             }} />
            </div>
        )
    }
}

const style = {
    container: {
        position: 'relative'
    },
    suggestionsContainer: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        border: '1px solid',
        backgroundColor: 'white'
    },
    suggestionsList: {
        listStyleType: 'none',
        padding: 0
    },
    suggestion: {
        cursor: 'default',
        padding: [10, 20]
    },
    suggestionFocused: {
        backgroundColor: 'lightgray'
    }
}

To.propTypes = {
    contacts: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    value: PropTypes.string,
    model: PropTypes.string.isRequired,
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    tabIndex: PropTypes.number,
    onFocus: PropTypes.func,
    inputRef: PropTypes.func,
    placeholder: PropTypes.string
}

To.defaultProps = {
    value: ''
}

function mapStateToProps(state, {model}) {
    return {
        contacts: state.contacts,
        currentUser: state.auth,
        value: get(state, model)
    }
}

export default useSheet(connect(mapStateToProps)(To), style)
