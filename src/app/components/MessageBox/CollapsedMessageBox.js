import React, {Component} from 'react'
import classAutobind from 'class-autobind'
import {connect} from 'react-redux'
import useSheet from 'react-jss'

import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'

class CollapsedMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CollapsedMessageBox.prototype)
    }

    newThingMessageBox() {
        const {dispatch} = this.props
        dispatch(MessageBoxActions.newMessageBox(MessageTypes.NEW_THING))
    }

    render () {
        const {sheet: {classes}} = this.props
        
        return (
            <Flexbox name="message-text" container="column" justifyContent="center" onClick={this.newThingMessageBox} className={classes.box}>
                <span className={classes.placeholder}>
                    Create a new Thing by typing here.
                </span>
            </Flexbox>
        )
    }
}

const style = {
    box: {
        height: '70px',
        backgroundColor: '#fafafa',
        opacity: '0.5',
        cursor: 'text',
        ':hover': {
            opacity: '1'
        }
    },
    placeholder: {
        paddingLeft: '10px',
        color: styleVars.watermarkColor
    }
}

export default useSheet(connect()(CollapsedMessageBox), style)
