import React, {Component} from 'react'
import classAutobind from 'class-autobind'
import clickOutside from 'react-click-outside'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import Icon from 'react-fontawesome'
import Link from '../UI/Link'
import styleVars from '../style-vars'

class SettingsMenu extends Component {
    constructor(props) {
        super(props)
        classAutobind(this, SettingsMenu.prototype)
    }

    componentWillMount() {
        this.setState({showMenu: false})
    }

    handleClickOutside() {
        this.closeSettingsMenu()
    }

    toggleSettingsMenu() {
        this.setState({showMenu: !this.state.showMenu})
    }

    closeSettingsMenu() {
        this.setState({showMenu: false})
    }

    getSettingMenu() {
        const {sheet: {classes}} = this.props
        return this.state.showMenu ? (
            <Flexbox name="settings-menu" grow={1} container="column" alignItems="center" className={classes.menu}>
                <span className={classes.arrow} />
                <Link to="/integrations" className={classes.menuOption} onClick={this.closeSettingsMenu}>Integrations</Link>
                <a href="/login/logout" className={classes.menuOption}>Logout</a>
            </Flexbox>
        ) : null
    }

    render() {
        const {sheet: {classes}} = this.props
        const menu = this.getSettingMenu()

        return (
            <Flexbox name="settings-container" className={classes.settings}>
                <Icon name="chevron-down" onClick={this.toggleSettingsMenu} className={classes.button} />
                {menu}
            </Flexbox>
        )
    }
}

const style = {
    settings: {
        position: 'relative'
    },
    button: {
        marginRight: 10,
        fontSize: '0.9em',
        cursor: 'pointer'
    },
    menu: {
        position: 'absolute',
        top: -120,
        left: -62,
        minHeight: 50,
        minWidth: 130,
        backgroundColor: styleVars.secondaryBackgroundColor,
        border: `1px solid ${styleVars.baseBorderColor}`
    },
    menuOption: {
        width: '100%',
        padding: 17,
        textAlign: 'center',
        cursor: 'pointer',
        color: 'black',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: '#ebe9e9'
        }
    },
    arrow: {
        position: 'absolute',
        left: 63,
        bottom: -6,
        width: 0,
        height: 0,
        borderRight: '5px solid transparent',
        borderLeft: '5px solid transparent',
        borderTop: `6px solid ${styleVars.secondaryBackgroundColor}`
    }
}

export default useSheet(clickOutside(SettingsMenu), style)