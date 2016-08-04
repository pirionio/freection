const React = require('react')
const {Component, PropTypes} = React
const {connect} = require('react-redux')
const classAutobind = require('class-autobind').default

class Action extends Component {
    constructor(props) {
        super(props)
        classAutobind(this)
    }

    doAction() {
        const {dispatch, doFunc, item} = this.props
        dispatch(doFunc(item))
    }
    
    render () {
        const {label, disabled} = this.props

        return (
            <div className="action-container">
                <button className="action-button" onClick={this.doAction} disabled={disabled}>{label}</button>
            </div>
        )
    }
}

Action.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    doFunc: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

Action.defaultProps = {
    disabled: false
}

module.exports = connect()(Action)