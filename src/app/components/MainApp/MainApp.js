const React = require('react')
const {Component} = React

const NewPanel = require('../NewPanel/NewPanel')

class MainApp extends Component {
    render () {
        return (
            <div className="main-app">
                {this.props.children}
                <NewPanel />
            </div>
        )
    }
}

MainApp.propTypes = {
}

module.exports = MainApp