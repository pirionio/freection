import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'

import Button from '../UI/Button'

class Command extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Command.prototype)
    }

    onClick(event) {
        event.stopPropagation()
        const {dispatch, commandType, commandFunc, requireText, requireTextFunc, item} = this.props

        if (requireText)
            requireTextFunc(commandType, text => {
                return dispatch(commandFunc(item, text))
            })
        else
            dispatch(commandFunc(item))
    }

    render () {
        const {label, disabled, tooltipText} = this.props

        return (
            <Button label={label} onClick={this.onClick} disabled={disabled} tooltipText={tooltipText} />
        )
    }
}

Command.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    commandType: PropTypes.string.isRequired,
    commandFunc: PropTypes.func.isRequired,
    requireText: PropTypes.bool.isRequired,
    requireTextFunc: PropTypes.func,
    disabled: PropTypes.bool,
    tooltipText: PropTypes.string
}

Command.defaultProps = {
    disabled: false,
    requireText: false
}

export default connect()(Command)
