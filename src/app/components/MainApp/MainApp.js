const React = require('react')
const {Component} = React
const useSheet = require('react-jss').default

const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class MainApp extends Component {
    render () {
        const {sheet: {classes}} = this.props
        return (
            <Flexbox name="main-app" grow={1} container="row" className={classes.container}>
                <Flexbox name="main-app-padding" grow={1} className={classes.padding} />
                <Flexbox name="main-app-content" container="column" className={classes.content}>
                    {this.props.children}
                </Flexbox>
            </Flexbox>
        )
    }
}

const style = {
    container: {
        minWidth: 0,
        padding: [35, 35, 0, 0],
        backgroundColor: styleVars.backgroundColor
    },
    content: {
        width: '100%',
        maxWidth: 1178,
    },
    padding: {
        minWidth: 35,
        maxWidth: 130
    }
}

MainApp.propTypes = {
}

module.exports = useSheet(MainApp, style)