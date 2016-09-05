const React = require('react')
const {PropTypes, Component} = React
const {connect} = require('react-redux')
const {actions} = require('react-redux-form')
const radium = require('radium')
const Autosuggest = require('react-autosuggest')
const merge = require('lodash/merge')
const omit = require('lodash/omit')
const some = require('lodash/some')
const takeRight = require('lodash/takeRight')
const orderBy = require('lodash/orderBy')
const get = require('lodash/get')

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
        const { value, containerStyle, inputStyle, tabIndex , onFocus, inputRef} = this.props

        /*<input type="text" style={inputStyle} tabIndex={tabIndex} placeholder="To"
         ref={ref => this.input = ref}
         onFocus={onFocus} />*/

        const suggestions = this.getSuggestions(value)

        const theme = {
            container: {position: 'relative'},
            suggestionsContainer: {
                position: 'absolute',
                bottom: '25px',
                left: 0,
                border: '1px solid',
                backgroundColor: 'white'
            },
            suggestionsList: {
                listStyleType: 'none',
                padding: 0,
            },
            suggestion: {
                cursor: 'default',
                paddingRight: '20px',
                paddingLeft: '20px',
                paddingTop: '10px',
                paddingBottom: '10px'
            },
            suggestionFocused: {
                backgroundColor: 'lightgray'
            }
        }

        return (
            <div name="message-to" style={containerStyle}>
                <Autosuggest suggestions={suggestions}
                             getSuggestionValue={this.getSuggestionValue}
                             renderSuggestion={this.renderSuggestion}
                             renderSuggestionsContainer={this.renderSuggestionContainer}
                             focusFirstSuggestion={true}
                             theme={theme}
                             ref={ref => {
                                 if(ref)
                                     inputRef(ref.input)
                             }}
                             inputProps={{
                                 type: 'text',
                                 style: inputStyle,
                                 tabIndex: tabIndex,
                                 placeholder: 'To',
                                 value:  value,
                                 onChange: this.onChange,
                                 onFocus: onFocus
                             }} />
            </div>
        )
    }
}

To.propTypes = {
    contacts: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    value: PropTypes.string,
    model: PropTypes.string.isRequired,
    containerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    tabIndex: PropTypes.number,
    onFocus: PropTypes.func,
    inputRef: PropTypes.func,
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

module.exports = connect(mapStateToProps)(radium(To))
