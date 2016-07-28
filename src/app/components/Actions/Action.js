const React = require('react')
const {Component, PropTypes} = React

class Action extends Component {
    render () {
        const {label, doFunc} = this.props

        return (
            <div className="action-container">
                <button onClick={doFunc}>{label}</button>
            </div>
        )
    }
}

Action.propTypes = {
    label: PropTypes.string.isRequired,
    doFunc: PropTypes.func.isRequired
}

module.exports = Action