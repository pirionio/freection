const React = require('react')
const {Component, PropTypes} = React
const {chain} = require('lodash/core')

class ActionsBar extends Component {
    render() {
        const actions = chain(this.props.actions)
            .filter('show')
            .map('component')
            .value()
        
        return (
            <div className="actions-bar">
                {actions}
            </div>
        )
    }
}

ActionsBar.propTypes = {
    actions: PropTypes.array.isRequired
}

module.exports = ActionsBar
