const React = require('react')
const {Component} = React
const radium = require('radium')
const Flexbox = require('../UI/Flexbox')

class MainApp extends Component {
    render () {
        return (
            <Flexbox grow={1} height='100%' style={{minWidth: 0}}>
                {this.props.children}
            </Flexbox>
        )
    }
}

MainApp.propTypes = {
}

module.exports = radium(MainApp)