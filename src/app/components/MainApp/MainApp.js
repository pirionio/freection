const React = require('react')
const {Component} = React

class MainApp extends Component {
    render () {
        return (
            <div className="main-app">
                {this.props.children}
            </div>
        )
    }
}

MainApp.propTypes = {
}

module.exports = MainApp