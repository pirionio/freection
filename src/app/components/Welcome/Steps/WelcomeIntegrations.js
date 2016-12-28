import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../../UI/Flexbox'
import WelcomeStep from '../WelcomeStep'
import SingleStar from '../../../static/logo-single-white.png'

class WelcomeIntegrations extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeIntegrations.prototype)
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <WelcomeStep title="Integrations">
                Integrations
            </WelcomeStep>
        )
    }
}

const style = {
}

WelcomeIntegrations.propTypes = {
}

export default useSheet(WelcomeIntegrations, style)