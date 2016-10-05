import React, {PropTypes, Component}  from 'react'
import {connect} from 'react-redux'
import {actions} from 'react-redux-form'
import Autosuggest from 'react-autosuggest'
import useSheet from 'react-jss'
import omit from 'lodash/omit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import * as ContactsActions from '../../actions/contacts-actions.js'

class To extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)

        this._fetchContactsTimeoutActive = false
    }

    renderSuggestion(suggestion) {
        return (
            <span>{`${suggestion.displayName} <${suggestion.payload.email}>`}</span>
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
        return `${suggestion.displayName} <${suggestion.payload.email}>`
    }

    onChange(event, {newValue, method}) {
        const {model, dispatch } = this.props

        dispatch(actions.change(model, newValue))

        if (method === 'enter' || method === 'down' || method === 'up') {
            event.preventDefault()
            event.stopPropagation()
        }
    }

    shouldFetchContacts(value) {
        const {query, pendingQuery} = this.props

        const valueLowered = value.toLowerCase()

        return (!isEmpty(valueLowered) &&
            ((isEmpty(pendingQuery) && valueLowered !== query) || (!isEmpty(pendingQuery) && valueLowered !== pendingQuery)))
    }

    onSuggestionsFetchRequested(valueObject) {
        const {dispatch} = this.props

        //Let's go and fetch the new contacts
        const value = valueObject.value

        if (this.shouldFetchContacts(value)) {

            if (this._fetchContactsTimeoutActive) {
                clearTimeout(this._timeoutId)
            }

            this._fetchContactsTimeoutActive = true
            this._timeoutId = setTimeout(() => {

                // we are checking again, as we might got a query back
                if (this.shouldFetchContacts(value))
                    dispatch(ContactsActions.get(value.toLowerCase()))

                this._fetchContactsTimeoutActive = false
            }, 200)
        } else if (this._fetchContactsTimeoutActive) {
            clearTimeout(this._timeoutId)
            this._fetchContactsTimeoutActive = false
        }
    }

    onSuggestionsClearRequested() {
        const {dispatch} = this.props

        if (this._fetchContactsTimeoutActive) {
            clearTimeout(this._timeoutId)
            this._fetchContactsTimeoutActive = false
        }

        dispatch(ContactsActions.clear())
    }

    render() {
        const {value,contacts, placeholder, containerClassName, inputClassName, tabIndex , onFocus, inputRef, sheet: {classes}} = this.props

        return (
            <div name="message-to" className={containerClassName}>
                <Autosuggest suggestions={contacts}
                             onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                             onSuggestionsClearRequested={this.onSuggestionsClearRequested}
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
    query: PropTypes.string,
    pendingQuery: PropTypes.string,
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
        contacts: state.contacts.contacts,
        query: state.contacts.query,
        pendingQuery: state.contacts.pendingQuery,
        currentUser: state.auth,
        value: get(state, model)
    }
}

export default useSheet(connect(mapStateToProps)(To), style)
