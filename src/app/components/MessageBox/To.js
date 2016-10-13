import React, {PropTypes, Component}  from 'react'
import {connect} from 'react-redux'
import {actions} from 'react-redux-form'
import Autosuggest from 'react-autosuggest'
import useSheet from 'react-jss'
import omit from 'lodash/omit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import * as ToActions from '../../actions/to-actions.js'
import styleVars from '../style-vars'

class To extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)

        this._fetchContactsTimeoutActive = false
    }

    componentDidMount() {
        const { dispatch } = this.props

        if (!this.isCached('m') && !this.isPending('m')) {
            dispatch(ToActions.get('m', true))
        }

        if (!this.isCached('me') && !this.isPending('me')) {
            dispatch(ToActions.get('me', true))
        }
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

    isCached(value) {
        const {cache} = this.props

        return cache[value]
    }

    isPending(value) {
        const {pendingQueries} = this.props

        pendingQueries.includes(value)
    }

    cancelTimer() {
        if (this._fetchContactsTimeoutActive) {
            clearTimeout(this._timeoutId)
            this._fetchContactsTimeoutActive = false
        }
    }

    onSuggestionsFetchRequested(valueObject) {
        const {dispatch, query} = this.props

        //Let's go and fetch the new contacts
        const value = valueObject.value.toLowerCase()

        if (this.isCached(value)) {
            this.cancelTimer()
            dispatch(ToActions.getFromCache(value))
        }
        else if (query !== value && !this.isPending(value)) {
            this.cancelTimer()

            this._fetchContactsTimeoutActive = true
            this._timeoutId = setTimeout(() => {
                dispatch(ToActions.get(value))
                this._fetchContactsTimeoutActive = false
            }, 200)
        } else {
            this.cancelTimer()
        }
    }

    onSuggestionsClearRequested() {
        const {dispatch} = this.props

        this.cancelTimer()

        dispatch(ToActions.clear())
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
        backgroundColor: 'white',
        zIndex: styleVars.toAutosuggestZIndex
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
    cache: PropTypes.object.isRequired,
    pendingQueries: PropTypes.array.isRequired,
    value: PropTypes.string,
    query: PropTypes.string,
    currentUser: PropTypes.object.isRequired,
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
        contacts: state.to.contacts,
        query: state.to.query,
        pendingQueries: state.to.pendingQueries,
        cache: state.to.cache,
        currentUser: state.auth,
        value: get(state, model)
    }
}

export default useSheet(connect(mapStateToProps)(To), style)
