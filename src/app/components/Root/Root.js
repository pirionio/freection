const React = require ('react')
const {Component} = React
const App = require('../App/App')

class Root extends Component {
    render () {
        return (
            <App />
        )
    }
}

Root.propTypes = {
}

module.exports = Root