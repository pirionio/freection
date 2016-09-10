import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import SettingsMenu from './SettingsMenu'

class UserSettings extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UserSettings.prototype)
    }

    render() {
        const {currentUser, sheet: {classes}} = this.props
        return (
            <Flexbox name="settings" container="row" justifyContent="space-around" alignItems="center" className={classes.settings}>
                <span className={classes.user}>{currentUser.firstName}</span>
                <SettingsMenu />
            </Flexbox>
        )
    }
}

const style = {
    settings: {
        height: 74,
        width: 185,
        margin: [0, 19],
        borderTop: '1px solid #232e34',
        color: 'white'
    },
    user: {
        letterSpacing: '0.1em'
    }
}

UserSettings.propTypes = {
    currentUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth
    }
}

export default useSheet(connect(mapStateToProps)(UserSettings), style)