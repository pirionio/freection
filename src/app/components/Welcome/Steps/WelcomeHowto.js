import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../../UI/Flexbox'
import WelcomeStep from '../WelcomeStep'
import SingleStar from '../../../static/logo-single-white.png'

class WelcomeHowto extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, WelcomeHowto.prototype)
    }

    render() {
        const {sheet: {classes}} = this.props

        return (
            <WelcomeStep title="How to use Freection">
                How To
            </WelcomeStep>
        )
    }
}

const style = {
}

WelcomeHowto.propTypes = {
}

export default useSheet(WelcomeHowto, style)