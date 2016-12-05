import React, {Component, PropTypes} from 'react'
import classAutobind from 'class-autobind'
import {connect} from 'react-redux'
import useSheet from 'react-jss'
import isEmpty from 'lodash/isEmpty'

import * as MessageBoxActions from '../../actions/message-box-actions'
import MessageTypes from '../../../common/enums/message-types'
import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'

class CollapsedMessageBox extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, CollapsedMessageBox.prototype)
    }

    openMessageBox() {
        const {dispatch, thing} = this.props

        if (!this.isInThingPage()) {
            dispatch(MessageBoxActions.newMessageBox(MessageTypes.NEW_THING))
        } else {
            dispatch(MessageBoxActions.newMessageBox(MessageTypes.COMMENT_THING, thing))
        }
    }

    isInThingPage() {
        return !isEmpty(this.props.thing)
    }

    getPlaceholder() {
        return !this.isInThingPage() ? 'Create a new Task by typing here.' : 'Comment by typing here.'
    }

    render () {
        const {sheet: {classes}} = this.props
        
        return (
            <Flexbox name="message-text" container="column" justifyContent="center" onClick={this.openMessageBox} className={classes.box}>
                <span className={classes.placeholder}>
                    {this.getPlaceholder()}
                </span>
            </Flexbox>
        )
    }
}

const style = {
    box: {
        height: '70px',
        backgroundColor: 'white',
        opacity: '0.7',
        borderTop: `1px solid ${styleVars.primaryColorHalfOpaque}`,
        borderLeft: `1px solid ${styleVars.primaryColorHalfOpaque}`,
        borderRight: `1px solid ${styleVars.primaryColorHalfOpaque}`,
        cursor: 'text',
        '&:hover': {
            opacity: '1'
        }
    },
    placeholder: {
        paddingLeft: '10px',
        color: styleVars.watermarkColor
    }
}

CollapsedMessageBox.propTypes = {
    thing: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        thing: state.thingPage.thing
    }
}

export default useSheet(connect(mapStateToProps)(CollapsedMessageBox), style)
