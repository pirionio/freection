const React = require('react')
const {Component} = React
const radium = require('radium')
const Flexbox = require('../UI/Flexbox')
const styleVars = require('../style-vars')

class MainApp extends Component {
    render () {
        const style = {
            minWidth: 0,
            padding: '35px 50px 20px 50px',
            backgroundColor: styleVars.backgroundColor
        }

        return (
            <Flexbox name="main-app" grow={1} height='100%' style={style}>
                {this.props.children}
            </Flexbox>
        )
    }
}

MainApp.propTypes = {
}

module.exports = radium(MainApp)