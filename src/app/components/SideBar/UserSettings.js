import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import classAutobind from 'class-autobind'
import useSheet from 'react-jss'
import Icon from 'react-fontawesome'

import Flexbox from '../UI/Flexbox'
import Link from '../UI/Link'

class UserSettings extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, UserSettings.prototype)

        this.state = {
            showMenu: false
        }
    }

    toggleSettingsMenu() {
        this.setState({showMenu: !this.state.showMenu})
    }

    closeSettingsMenu() {
        this.setState({showMenu: false})
    }

    isOpen() {
        return this.state.showMenu
    }

    getSettingMenu() {
        const {sheet: {classes}} = this.props
        return this.isOpen() ? (
            <Flexbox name="settings-menu" grow={1} container="column" justifyContent="space-between" className={classes.menu}>
                <Link to="/all/things" className={classes.menuOption} onClick={this.closeSettingsMenu}>All Things</Link>
                <Link to="/integrations" className={classes.menuOption} onClick={this.closeSettingsMenu}>Integrations</Link>
                <a href="/login/logout" className={classes.menuOption}>Logout</a>
            </Flexbox>
        ) : null
    }

    render() {
        const {currentUser, sheet: {classes}} = this.props

        const settingsMenu = this.getSettingMenu()

        return (
            <Flexbox name="settings" container="row" justifyContent="space-between" alignItems="center" className={classes.container}>
                <span className={classes.user}>{currentUser.firstName}</span>
                <Icon name={this.isOpen() ? 'chevron-down' : 'chevron-up'} onClick={this.toggleSettingsMenu} className={classes.menuButton} />
                {settingsMenu}
            </Flexbox>
        )
    }
}

const style = {
    container: {
        position: 'relative',
        height: 60,
        width: '100%',
        padding: [0, 27],
        backgroundColor: '#242f35',
        color: 'white'
    },
    user: {
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
    },
    menuButton: {
        marginRight: 10,
        fontSize: '0.9em',
        cursor: 'pointer'
    },
    menu: {
        position: 'absolute',
        width: '100%',
        height: 112,
        top: -112,
        left: 0,
        padding: [23, 27],
        backgroundColor: '#2a373f'
    },
    menuOption: {
        width: '100%',
        cursor: 'pointer',
        color: '#959a9d',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        '&:hover': {
            color: 'white'
        }
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