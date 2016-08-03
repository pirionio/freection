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
        const {label} = this.props

        return (
            <div className="action-container">
                <button onClick={this.doAction}>{label}</button>
            </div>
        )
    }
}

Action.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
    doFunc: PropTypes.func.isRequired
}

module.exports = connect()(Action)