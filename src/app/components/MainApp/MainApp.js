const React = require('react')
const {Component} = React
const radium = require('radium')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class MainApp extends Component {
    render () {
        return (
            <Flexbox name="main-app" grow={1} height='100%' style={{minWidth: 0, backgroundColor: styleVars.backgroundColor}}>
                {this.props.children}
            </Flexbox>
        )
    }
}

MainApp.propTypes = {
}

module.exports = radium(MainApp)