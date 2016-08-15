const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default
const radium = require('radium')

const Button = require('../UI/Button')

class Action extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, Action.prototype)
    }

    doAction(event) {
        event.stopPropagation()
        const {dispatch, doFunc, item} = this.props
        dispatch(doFunc(item))
    }
    
    render () {
        const {label, disabled, style} = this.props

        return (
            <Button label={label} onClick={this.doAction} disabled={disabled} style={style} />
        )
    }
}

Action.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    doFunc: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    style: PropTypes.object
}

Action.defaultProps = {
    disabled: false
}

module.exports = connect()(radium(Action))