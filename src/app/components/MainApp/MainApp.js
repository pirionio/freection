const React = require('react')
const {Component} = React

const WhatsNew = require('../WhatsNew/WhatsNew')
const NewPanel = require('../NewPanel/NewPanel')

class MainApp extends Component {
    render () {
        return (
            <div className="main-app">
                <WhatsNew />
                <NewPanel />
            </div>
        )
    }
}

MainApp.propTypes = {
}

module.exports = MainApp