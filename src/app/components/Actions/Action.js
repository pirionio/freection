import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'

import Button from '../UI/Button'

class Action extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Action.prototype)
    }

    doAction(event) {
        event.stopPropagation()
        const {dispatch, doFunc, preDoFunc, item} = this.props

        if (preDoFunc)
            preDoFunc(result => {
                return dispatch(doFunc(item, result))
            })
        else
            dispatch(doFunc(item))
    }
    
    render () {
        const {label, disabled} = this.props

        return (
            <Button label={label} onClick={this.doAction} disabled={disabled} />
        )
    }
}

Action.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    doFunc: PropTypes.func.isRequired,
    preDoFunc: PropTypes.func,
    disabled: PropTypes.bool
}

Action.defaultProps = {
    disabled: false
}

export default connect()(Action)