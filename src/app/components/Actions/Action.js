const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

const Button = require('../UI/Button')

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
                dispatch(doFunc(item, result))
            })
        else
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
    preDoFunc: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object
}

Action.defaultProps = {
    disabled: false
}

module.exports = connect()(Action)