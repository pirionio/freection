const React = require('react')
const {Component, PropTypes} = React
const {chain} = require('lodash/core')
const head = require('lodash/head')
const Flexbox = require('../UI/Flexbox')
const classAutobind = require('class-autobind').default
const Transition = require('react-motion-ui-pack')

class ActionsBar extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, ActionsBar.prototype)
    }

    getAllActions() {
        return chain(this.props.actions)
            .filter('show')
            .map('component')
            .value()
    }

    getFirstAction() {
        return head(this.getAllActions())
    }

    getRestOfActions() {
        return this.getAllActions().slice(1)
    }

    render() {
        const {supportRollover, isRollover} = this.props

        const firstAction = this.getFirstAction()
        const restOfActions = this.getRestOfActions()

        if (!supportRollover) {
            return (
                <Flexbox name="actions-bar" container='row-reverse'>
                    {[firstAction, ...restOfActions]}
                </Flexbox>
            )
        }

        return (
            <Flexbox name="actions-bar" container='row-reverse'>
                {firstAction}
                <Transition component="div"
                            enter={{opacity: isRollover ? 1 : 0}}
                            leave={{opacity: 0}}
                            appear={{opacity: 0}}>
                    <div key="rest-of-actions">
                        <Flexbox name="rest-of-actions-row" container="row-reverse">
                            {restOfActions}
                        </Flexbox>
                    </div>
                </Transition>
            </Flexbox>
        )
    }
}

ActionsBar.propTypes = {
    actions: PropTypes.array.isRequired,
    supportRollover: PropTypes.bool,
    isRollover: PropTypes.bool
}

ActionsBar.defaultProps = {
    supportRollover: true,
    isRollover: false
}

module.exports = ActionsBar
