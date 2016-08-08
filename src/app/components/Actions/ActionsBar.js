const React = require('react')
const {Component, PropTypes} = React
const {chain} = require('lodash/core')
const Flexbox = require('../UI/Flexbox')

class ActionsBar extends Component {
    render() {
        const actions = chain(this.props.actions)
            .filter('show')
            .map('component')
            .value()

        return (
            <Flexbox container='row-reverse'>
                {actions}
            </Flexbox>
        )
    }
}

ActionsBar.propTypes = {
    actions: PropTypes.array.isRequired
}

module.exports = ActionsBar
