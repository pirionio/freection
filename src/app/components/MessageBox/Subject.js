import React, {Component, PropTypes} from 'react'
import {Field} from 'react-redux-form'
import Autobind from 'class-autobind'

import {isCommandEnter} from '../../helpers/key-binding-helper.js'

class Subject extends Component {

    constructor(props) {
        super(props)

        Autobind(this, Subject.prototype)
    }

    onKeyDown(event) {
        const {onCommandEnter} = this.props

        if (isCommandEnter(event) && onCommandEnter)
            setTimeout(() => onCommandEnter())
    }

    render() {
        const {tabIndex, model, className, placeholder, onFocus, inputRef} = this.props

        return (
            <Field model={model}>
                <input type="text"
                       tabIndex={tabIndex}
                       className={className}
                       placeholder={placeholder}
                       ref={ref => {
                           if (inputRef)
                               inputRef(ref)
                       }}
                       onFocus={onFocus}
                       onKeyDown={this.onKeyDown} />
            </Field>
        )
    }
}

Subject.propTypes = {
    tabIndex: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    inputRef: PropTypes.func,
    onCommandEnter: PropTypes.func
}

export default Subject