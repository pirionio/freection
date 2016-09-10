import React, {Component} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import NavigationMenu from './NavigationMenu'
import UserSettings from './UserSettings'
import logo from '../../static/logo-white.png'

class SideBar extends Component {
    render() {
        const {classes} = this.props.sheet

        return (
            <Flexbox name="side-bar" shrink={0} container="column" className={classes.sideBar}>
                <Flexbox name="logo-container" container="row" justifyContent="center" alignItems="center" className={classes.logoContainer}>
                    <img src={logo} className={classes.logoImage} />
                </Flexbox>
                <NavigationMenu />
                <UserSettings />
            </Flexbox>
        )
    }
}

const styles = {
    sideBar: {
        width: 222,
        height: '100%',
        backgroundColor: styleVars.primaryColor
    },
    logoContainer: {
        width: 185,
        height: 75,
        borderBottom: {
            width: 1,
            style: 'solid',
            color: '#232e34'
        },
        margin: [0, 19]
    },
    logoImage: {
        width: 45,
        height: 15
    }
}

export default useSheet(SideBar, styles)