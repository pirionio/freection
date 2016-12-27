import React, {Component} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import ExpandedMessageBox from '../MessageBox/ExpandedMessageBox.js'
import SideBar from '../SideBar/SideBar'
import GlassPane from '../GlassPane/GlassPane'
import {GlassPaneIds} from '../../constants'

class MainApp extends Component {
    render () {
        const {sheet: {classes}} = this.props
        return (
            <Flexbox name="main-app" grow={1} container="row" className={classes.container}>
                <SideBar />
                <Flexbox name="app-section" grow={1} container="row" className={classes.content}>
                    <Flexbox name="app-padding" grow={1} className={classes.padding} />
                    <Flexbox name="app-content" container="column" className={classes.actualContent}>
                        {this.props.children}
                        <ExpandedMessageBox />
                    </Flexbox>
                    <GlassPane name={GlassPaneIds.MAIN_APP} />
                </Flexbox>
                <GlassPane name={GlassPaneIds.WHOLE_APP} />
            </Flexbox>
        )
    }
}

const style = {
    container: {
        height: '100%'
    },
    content: {
        minWidth: 0,
        padding: [styleVars.mainAppPadding, 0, 0, 0],
        backgroundColor: styleVars.backgroundColor,
        position: 'relative'
    },
    actualContent: {
        position: 'relative',
        width: '100%',
        maxWidth: 1568
    },
    padding: {
        minWidth: styleVars.mainAppPadding,
        maxWidth: 130
    }
}

MainApp.propTypes = {
}

export default useSheet(MainApp, style)