const React = require('react')
const {Component} = React

const MessageBox = require('../MessageBox/MessageBox')

class MainApp extends Component {
    render () {
        return (
            <div className="main-app">
                {this.props.children}
                <MessageBox />
            </div>
        )
    }
}

MainApp.propTypes = {
}

module.exports = MainApp