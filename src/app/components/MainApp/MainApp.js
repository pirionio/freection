import React, {Component} from 'react'
import useSheet from 'react-jss'

import Flexbox from '../UI/Flexbox'
import styleVars from '../style-vars'
import ExpandedMessageBox from '../MessageBox/ExpandedMessageBox.js'

class MainApp extends Component {
    render () {
        const {sheet: {classes}} = this.props
        return (
            <Flexbox name="main-app" grow={1} container="row" className={classes.container}>
                <Flexbox name="main-app-padding" grow={1} className={classes.padding} />
                <Flexbox name="main-app-content" container="column" className={classes.content}>
                    {this.props.children}
                    <ExpandedMessageBox />
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        minWidth: 0,
        padding: [styleVars.mainAppPadding, styleVars.mainAppPadding, 0, 0],
        backgroundColor: styleVars.backgroundColor
    },
    content: {
        position: 'relative',
        width: '100%',
        maxWidth: 1178,
    },
    padding: {
        minWidth: styleVars.mainAppPadding,
        maxWidth: 130
    }
}

MainApp.propTypes = {
}

export default useSheet(MainApp, style)