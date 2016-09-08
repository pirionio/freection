import React, {Component, PropTypes} from 'react'
import {chain} from 'lodash/core'
import head from 'lodash/head'
import Flexbox from '../UI/Flexbox'
import classAutobind from 'class-autobind'
import Transition from 'react-motion-ui-pack'
import useSheet from 'react-jss'
import classNames from 'classnames'

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
        const {supportRollover, sheet: {classes}} = this.props

        const firstAction = this.getFirstAction()
        const restOfActions = this.getRestOfActions()

        if (!supportRollover) {
            return (
                <Flexbox name="actions-bar" container='row-reverse'>
                    {[firstAction, ...restOfActions]}
                </Flexbox>
            )
        }

        const restOfActionsClass = classNames(classes.restOfActions, 'restOfActions')

        return (
            <Flexbox name="actions-bar" container='row-reverse'>
                {firstAction}
                <Transition component="div"
                            enter={{opacity: 1}}
                            leave={{opacity: 0}}
                            appear={{opacity: 0}}>
                    <div key="rest-of-actions" className={restOfActionsClass}>
                        <Flexbox name="rest-of-actions-row" container="row-reverse">
                            {restOfActions}
                        </Flexbox>
                    </div>
                </Transition>
            </Flexbox>
        )
    }
}

const style = {
    restOfActions: {
        display: 'none'
    }
}

ActionsBar.propTypes = {
    actions: PropTypes.array.isRequired,
    supportRollover: PropTypes.bool
}

ActionsBar.defaultProps = {
    supportRollover: true
}

export default useSheet(ActionsBar, style)
