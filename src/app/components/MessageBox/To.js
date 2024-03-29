import React, {PropTypes, Component}  from 'react'
import {connect} from 'react-redux'
import {actions} from 'react-redux-form'
import Autosuggest from 'react-autosuggest'
import useSheet from 'react-jss'
import omit from 'lodash/omit'
import get from 'lodash/get'
import isString from 'lodash/isString'
import AddressParser from 'email-addresses'
import Autobind from 'class-autobind'

import Flexbox from '../UI/Flexbox.js'
import * as ToActions from '../../actions/to-actions.js'
import styleVars from '../style-vars'
import Close from '../../static/close-selected-box.svg'
import {isCommandEnter} from '../../helpers/key-binding-helper.js'
import UserTypes from '../../../common/enums/user-types.js'
import GmailLogo from '../../static/GmailLogo.svg'
import FreectionLogo from '../../static/logo-black-39x10.png'
import SlackLogo from '../../static/SlackLogo.svg'
import {emailToAddress} from '../../../common/util/email-to-address'

class To extends Component {

    constructor(props) {
        super(props)

        Autobind(this, To.prototype)

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

    getSuggestionIcon(suggestion) {
        const {sheet: {classes}} = this.props

        switch (suggestion.type) {
            case UserTypes.FREECTION.key:
                return <img src={FreectionLogo} className={classes.suggestionIconRectangle} />
            case UserTypes.EMAIL.key:
                return <img src={GmailLogo} className={classes.suggestionIconSquare} />
            case UserTypes.SLACK.key:
                return <img src={SlackLogo} className={classes.suggestionIconSquare} />
        }
    }

    renderSuggestion(suggestion) {
        const {sheet: {classes}} = this.props

        const extraInfo = suggestion.type === UserTypes.EMAIL.key ? suggestion.payload.email :
            suggestion.type === UserTypes.SLACK.key ? suggestion.payload.username :
            null

        return (
            <Flexbox container>
                <Flexbox container="column" justifyContent="center" shrink={0} grow={0} className={classes.suggestionIconBox}>
                    {this.getSuggestionIcon(suggestion)}
                </Flexbox>
                <Flexbox container="column" justifyContent="center" className={classes.autoCompleteName} grow={1}>{suggestion.displayName}</Flexbox>

                {extraInfo ? <Flexbox container="column" justifyContent="center"className={classes.autoCompleteEmail}>{extraInfo}</Flexbox> : null}
            </Flexbox>
        )
    }

    onSuggestionSelected(value) {
        const {model, dispatch} = this.props

        const address = isString(value) ? emailToAddress(value) : value

        dispatch(actions.change(`${model}.selected`, true))
        dispatch(actions.change(`${model}.selectedAddress`, address))
        setTimeout(() => this.focus())
    }

    removeSelected() {
        const {model, dispatch} = this.props

        dispatch(actions.change(`${model}.selected`, false))
        dispatch(actions.change(`${model}.selectedAddress`, null))
        dispatch(actions.change(`${model}.to`, ''))
    }

    focus() {
        const {selected} = this.props

        if (!selected && this._inputRef)
            this._inputRef.focus()
        if (selected && this._selectedBox)
            this._selectedBox.focus()
    }

    onSelectedBoxKeyDown(event) {
        const {onCommandEnter} = this.props

        if (event.key === 'Delete' || event.key === 'Backspace') {
            this.removeSelected()
        }

        if (isCommandEnter(event) && onCommandEnter)
            setTimeout(() => onCommandEnter())
    }

    onInputKeyDown(event) {
        const {value, onCommandEnter} = this.props

        if (event.key === 'Enter') {
            const address = AddressParser.parseOneAddress(value)

            if (address)
                this.onSuggestionSelected(value)
        }

        if (isCommandEnter(event) && onCommandEnter)
            setTimeout(() => onCommandEnter())
    }

    onInputBlur() {
        const {value} = this.props

        const address = AddressParser.parseOneAddress(value)

        if (address) {
            this.onSuggestionSelected(value)
        }
    }

    renderSuggestionContainer(props) {
        const {style, children} = props
        const anyChildren = React.Children.count(children)
        const propsWithoutChildrenAndStyle = omit(props, ['children', 'style'])

        return <div style={anyChildren ? style : {display:'none'}} {...propsWithoutChildrenAndStyle}>
                {children}
            </div>
    }

    getSuggestionValue(suggestion) {
        if (suggestion.type === UserTypes.EMAIL.key)
            return `"${suggestion.displayName}" <${suggestion.payload.email}>`

        if (suggestion.type === UserTypes.SLACK.key)
            return suggestion.payload.username

        return suggestion.displayName
    }

    onChange(event, {newValue, method}) {
        const {model, dispatch } = this.props
        dispatch(actions.change(`${model}.to`, newValue))

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
        const {value, selected, selectedAddress, contacts, placeholder, containerClassName, inputClassName, tabIndex , onFocus, inputRef, sheet: {classes}} = this.props

        if (selected) {
            const name = selectedAddress.displayName

            return (
                <div name="message-to" className={containerClassName}>
                    <Flexbox className={classes.selectedBox} inline={true} container="row" alignItems="center" tabIndex={tabIndex}
                             onKeyDown={this.onSelectedBoxKeyDown}
                             onFocus={onFocus}
                             ref={ref => this._selectedBox = ref}>
                        {this.getSuggestionIcon(selectedAddress)}
                        <span>{name}</span>
                        <img src={Close} className={classes.removeSelectedButton} onClick={this.removeSelected} />
                    </Flexbox>
                </div>
            )
        }

        return (
            <div name="message-to" className={containerClassName}>
                <Autosuggest suggestions={contacts}
                             onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                             onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                             getSuggestionValue={this.getSuggestionValue}
                             onSuggestionSelected={(event, data) => this.onSuggestionSelected(data.suggestion)}
                             renderSuggestion={this.renderSuggestion}
                             renderSuggestionsContainer={this.renderSuggestionContainer}
                             focusFirstSuggestion={true}
                             theme={classes}
                             ref={ref => {
                                 inputRef(this)

                                 if (ref)
                                     this._inputRef = ref.input
                                 else
                                     this._inputRef = null
                             }}
                             inputProps={{
                                 type: 'text',
                                 className: inputClassName,
                                 tabIndex: tabIndex,
                                 placeholder: placeholder,
                                 value:  value,
                                 onChange: this.onChange,
                                 onKeyDown: this.onInputKeyDown,
                                 onBlur: this.onInputBlur,
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
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
        width: '400px',
        backgroundColor: 'white',
        zIndex: styleVars.toAutosuggestZIndex
    },
    suggestionsList: {
        listStyleType: 'none',
        padding: 0,
        marginTop: 8,
        marginBottom: 8,
        marginLeft:0,
        marginRight:0
    },
    suggestion: {
        height: 32,
        cursor: 'default',
        paddingLeft: 20,
        paddingRight: 20
    },
    suggestionIconBox: {
        width: '55px',
    },
    suggestionIconSquare: {
        height: 15,
        width: 15,
        marginRight: 8
    },
    suggestionIconRectangle: {
        height: 9,
        width: 39,
        marginRight: 8
    },
    suggestionFocused: {
        backgroundColor: styleVars.suggestionColor
    },
    autoCompleteName: {
        height: '100%',
        fontSize: '0.857em',
        letterSpacing: '0.025em'
    },
    autoCompleteEmail: {
        height: '100%',
        fontSize: '0.857em',
        fontWeight: 500,
        letterSpacing: '0.025em'
    },
    selectedBox: {
        border: '1px solid black',
        height: '26px',
        marginTop: '2px',
        marginBottom: '2px',
        paddingLeft: '10px',
        paddingRight: '10px',
        fontSize: '0.857em',
        fontWeight: 500,
        marginRight: '10px',
        outline: 'none',
        cursor: 'default',
        '&:focus':{
            border: `1px solid ${styleVars.baseBlueColor}`
        }
    },
    removeSelectedButton: {
        marginLeft: 18,
        marginTop: 2,
        height: 8,
        width: 8,
        letterSpacing: '0.05em',
        cursor: 'pointer'
    }
}


To.propTypes = {
    contacts: PropTypes.array.isRequired,
    cache: PropTypes.object.isRequired,
    pendingQueries: PropTypes.array.isRequired,
    value: PropTypes.string,
    selectedAddress: PropTypes.object,
    selected: PropTypes.bool,
    query: PropTypes.string,
    currentUser: PropTypes.object.isRequired,
    model: PropTypes.string.isRequired,
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    tabIndex: PropTypes.number,
    onFocus: PropTypes.func,
    inputRef: PropTypes.func,
    placeholder: PropTypes.string,
    onCommandEnter: PropTypes.func
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
        currentUser: state.userProfile,
        value: get(state, `${model}.to`),
        selectedAddress: get(state, `${model}.selectedAddress`),
        selected: get(state, `${model}.selected`)
    }
}

export default useSheet(connect(mapStateToProps)(To), style)
