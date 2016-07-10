const React = require('react')
const {Component} = React

class AppHeader extends Component {
    render () {
        return (
            <div className="app-header">
                <div className="new-thing">
                    <button onclick="">New</button>
                </div>
            </div>
        )
    }
}

AppHeader.propTypes = {
}

module.exports = AppHeader